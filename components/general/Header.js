import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { UserContext } from "../../contexts/userContext";

const Header = ({ transparentHeader = false }) => {
  const { user, userExists } = useContext(UserContext);
  useEffect(() => {});

  return (
    <header
      className={transparentHeader ? "header header--transparent" : "header"}
    >
      <div className="header__content">
        <div className="header__left">
          <div className="icon-container">
            <Link href="/">
              <a className="header__title">
                <img
                  className="icon--large"
                  src="../images/icons/cur_icon.png"
                />
                <h3>{process.env.APP_NAME} Beta</h3>
              </a>
            </Link>
          </div>
        </div>
        <div className="header__right">
          <h4>
            {userExists() ? (
              <Link href="/dashboard">
                <a>{user.username}</a>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <a>Log in</a>
                </Link>
                <Link href="/signup">
                  <a>Sign up</a>
                </Link>
              </>
            )}
          </h4>
        </div>
      </div>
    </header>
  );
};

export default Header;
