import React, { useContext, useState } from "react";
import Router from "next/router";
import { UserContext } from "../../contexts/userContext";
import { auth } from "../../lib/api";
import { useCookies } from 'react-cookie';

const DashboardHeader = () => {
	const [cookies, setCookie, removeCookie] = useCookies(['secret']);
  const {
    userExists,
    getUser,
    clearUser,
    setLoggingOut,
    setAuth,
    setNav,
		reset,
		setChangingResume,
  } = useContext(UserContext);
  const handleLogout = async () => {
    setLoggingOut(true);
    setAuth(false);
		localStorage.removeItem("userId");
		removeCookie('secret')
    await auth({ type: "LOGOUT", secret: cookies.secret });
    clearUser();
  };
  const openSettings = () => {
    setChangingResume(false);
    setNav(1000);
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
          <a onClick={openSettings}>Settings</a>
          <a onClick={handleLogout}>Log out</a>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
