import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { fauna } from "../../lib/api";

const DashboardHeader = () => {
  const {
    userExists,
    user,
    clearUser,
    setLoggingOut,
    setAuth,
    setNav,
    reset,
    setChangingResume,
    setPreview,
    status,
    changingResume,
  } = useContext(UserContext);
  const handleLogout = async () => {
    setLoggingOut(true);
    setAuth(false);
    await fauna({ type: "LOGOUT_USER" });
    clearUser();
  };
  const handleGoBack = () => {
    setPreview(true);
    reset();
  };
  const openSettings = () => {
    setChangingResume(false);
    setNav(1000);
  };
  const getStatusClassName = () => {
    const className = "header--status";
    if (status.startsWith("Error")) {
      return `${className} ${className}--error`;
    }
    return className;
  };
  return (
    <header className="header">
      <div className="header__content header__content--dashboard">
        <div className="header__left">
          <div className="icon-container">
            <h3>
              <a className="header__title" onClick={handleGoBack}>
                <img
                  className="icon--large"
                  src="../images/icons/cur_icon.png"
                />
                <span className="header__title--text">
                  {userExists() ? user.username : process.env.APP_NAME}
                </span>
              </a>
            </h3>
            {changingResume && (
              <span className={getStatusClassName()}>{status}</span>
            )}
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
