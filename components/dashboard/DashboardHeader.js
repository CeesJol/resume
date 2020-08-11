import React, { useContext, useState } from "react";
import Router from "next/router";
import { UserContext } from "../../contexts/userContext";
import { logout } from "../../pages/api/auth";

const DashboardHeader = () => {
  const { userExists, getUser, clearUser, setLoggingOut, setAuth, setNav, reset } = useContext(UserContext);
  const handleLogout = async () => {
		setLoggingOut(true);
		setAuth(false);
		localStorage.removeItem("user");
    await logout(getUser().secret);
    clearUser();
  };
  return (
    <header className="header">
      <div className="header__content header__content--dashboard">
        <div className="header__left">
          <div className="icon-container">
            <h3>
              <a className="header__title" onClick={reset}>
                <img className="icon--large" src="../images/icon-small.png" />
                {userExists() ? getUser().username : "Loading..."}
              </a>
            </h3>
          </div>
        </div>
        <div className="header__right">
					<a onClick={() => setNav(1000)}>Settings</a>
          <a onClick={handleLogout}>Log out</a>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
