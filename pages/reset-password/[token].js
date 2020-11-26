import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "../../components/general/Button";
import { UserContext } from "../../contexts/userContext";
import { toast } from "react-toastify";
import { fauna } from "../../lib/api";

const Token = () => {
  const [password, setPassword] = useState("");
  const { userExists, setLoggingOut } = useContext(UserContext);
  const handleResetPassword = async (event) => {
    if (event) event.preventDefault();
    const token = window.location.pathname.substring(16);
    await fauna({
      type: "UPDATE_USER_PASSWORD_NO_SECRET",
      token,
      password,
    }).then(
      () => {
        toast.success("💾 Updated password successfully!");
        Router.push("/login");
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("login err", err);
      }
    );
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value.toLowerCase());
  };
  useEffect(() => {
    setLoggingOut(false);
    if (userExists()) {
      // User is already logged in
      Router.push("/dashboard");
    }
  });

  return (
    <div className="login">
      <div className="login__box">
        <div className="login__box__content">
          <form>
            <div className="icon-container">
              <img className="icon--large" src="../images/icon-small.png" />
              <h3 className="login__box--title">Affilas</h3>
            </div>
            <>
              <h4 className="login__box--subtitle">
                Please enter a new password.
              </h4>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChangePassword}
              />

              <Button
                fn={handleResetPassword}
                text="Update password"
                altText="Updating password..."
              />
            </>
          </form>
        </div>
      </div>
      <p>
        <Link href="/login">
          <a>Log in instead</a>
        </Link>
      </p>
    </div>
  );
};

export default Token;
