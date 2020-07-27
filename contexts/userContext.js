import React, { createContext, useState, useEffect } from "react";
export const UserContext = createContext();

import { identity } from "../pages/api/auth";
import { readUser } from "../pages/api/fauna";

const UserContextProvider = (props) => {
	const [user, setUser] = useState(null);
	const [auth, setAuth] = useState(false);
  const storeUser = (data) => {
    // Set state
    setUser((prevUser) => ({ ...prevUser, ...data }));
  };
  const getUser = () => {
    return user;
  };
  const clearUser = () => {
    // Reset localstorage
    localStorage.removeItem("user");

    // Reset state
    setUser(null);
  };
  const userExists = () => {
    return user != null;
  };
  useEffect(() => {
		console.log('new user info', user);
    if (user == null) {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser != null && localUser.secret != null) {
        storeUser(localUser);
        identity(localUser.secret).then(
          (data) => {
            // Database confirms that user is logged in!
            storeUser(localUser);
            setAuth(true);
            // Update user info
            readUser(localUser.id).then(
              (data) => {
                storeUser(data.findUserByID);
                console.log('readUser', data.findUserByID);
              },
              (err) => {
                console.log("Fucked up getting the user data", err);
              }
            );
          },
          (err) => {
            // Database denies that user is logged in!
            console.log("localUser", localUser);
            console.log("Your secret is fake news", err);
            clearUser();
          }
        );
      } else {
        // There is no user data
        clearUser();
      }
    }

    // Set localstorage
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return (
    <UserContext.Provider
      value={{
        storeUser,
        getUser,
        clearUser,
				userExists,
				auth, setAuth
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
