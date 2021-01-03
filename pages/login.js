import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "../components/general/Button";
import { UserContext } from "../contexts/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userExists, setLoggingOut, handleLogin } = useContext(UserContext);
  const handleChangeEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
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
              <h3 className="login__box--title">{process.env.APP_NAME}</h3>
            </div>
            <h4 className="login__box--subtitle">
              Log in with your email address and password
            </h4>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={handleChangeEmail}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChangePassword}
            />

            <p
              style={{ fontSize: "1.4rem", marginBottom: "0", marginTop: "0" }}
            >
              <Link href="/forgot-password">
                <a>Forgot your password?</a>
              </Link>
            </p>

            <Button
              fn={() => handleLogin(email, password)}
              text="Log in"
              altText="Logging in..."
            />
          </form>
        </div>
      </div>
      <p>
        Don't have an account yet?{" "}
        <Link href="/signup">
          <a>Sign up</a>
        </Link>
      </p>
    </div>
  );
};

export default Login;
