import React, { createContext, useState, useEffect } from "react";
export const UserContext = createContext();

import { identity } from "../pages/api/auth";
import { readUser, updateItemPriority } from "../pages/api/fauna";

const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [nav, setNav] = useState(0);
  const [editingItem, setEditingItem] = useState(-1);
  const [editingResume, setEditingResume] = useState(-1);
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  const [warning, setWarning] = useState(false);
  const [changingInfo, setChangingInfo] = useState(false);
  const [userMadeChanges, setUserMadeChanges] = useState(false);
  const storeUser = (data) => {
    // Set state
    setUser((prevUser) => ({ ...prevUser, ...data }));
  };
  const storeItem = (itemData, del) => {
    var user = getUser();

    // jr developer: the code isnt that bad
    // the code:
    user.resumes.data.some((resume, r) => {
      if (resume._id === editingResume._id) {
        resume.categories.data.some((category, c) => {
          if (category._id === editingItem.category._id) {
            category.items.data.some((item, i) => {
              if (item._id === editingItem._id) {
                if (del) {
                  // Delete item
                  user.resumes.data[r].categories.data[
                    c
                  ].items.data = user.resumes.data[r].categories.data[
                    c
                  ].items.data.filter((x) => x._id !== itemData._id);
                } else {
                  // Update item
                  var newItem = { ...item, ...itemData };
                  user.resumes.data[r].categories.data[c].items.data[
                    i
                  ] = newItem;
                  setEditingItem(newItem);
                }
                return true; // break the loop
              } else if (i === category.items.data.length - 1) {
                // Add item
                user.resumes.data[r].categories.data[c].items.data.push(
                  itemData
                );
                setEditingItem(itemData);
              }
            });
            return true; // break the loop
          }
        });
        return true; // break the loop
      }
    });

    setUser(() => user);
  };
  const storeResume = (resumeData) => {
    var user = getUser();

    user.resumes.data.forEach((resume, r) => {
      if (resume._id === editingResume._id) {
        var newResume = { ...resume, ...resumeData };
        user.resumes.data[r] = newResume;
        setEditingResume(newResume);
      }
    });

    setUser(() => user);
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
  const handleMutation = () => {
    // readUser();
    setEditingItem(-1);
  };
  const handleMove = (amount) => {
    // item.category.
    // updateItemPriority(item._id, item.priority - amount);
  };
  useEffect(() => {
    // console.log('new user info', user);
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
                console.log("readUser", data.findUserByID);
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
        auth,
        setAuth,
        nav,
        setNav,
        editingItem,
        setEditingItem,
        editingResume,
        setEditingResume,
        data,
        setData,
        error,
        setError,
        warning,
        setWarning,
        changingInfo,
        setChangingInfo,
        handleMutation,
        handleMove,
        storeItem,
        storeResume,
        userMadeChanges,
        setUserMadeChanges,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
