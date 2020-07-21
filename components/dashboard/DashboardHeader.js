import React, { useContext, useEffect } from "react";
import Router from "next/router";
import { UserContext } from "../../contexts/userContext";

import { logout } from "../../pages/api/auth";

const DashboardHeader = () => {
  const { userExists, getUser, clearUser } = useContext(UserContext);
  const handleLogout = () => {
    logout(getUser().secret);
		clearUser();
    Router.push("/login");
  };
  return (
    <header className="header">
      <div className="header__content header__content--dashboard">
        <div className="header__left">
          <div className="icon-container">
            <h3>
              <a className="header__title" onClick={Router.reload}>
								<img className="icon--large" src="../images/icon-small.png" />
                {userExists() ? getUser().username : "Loading..."}
              </a>
            </h3>
          </div>
        </div>
        <div className="header__right">
          <a onClick={handleLogout}>Log out</a>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
