import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "../components/general/Button";
import { login, signup } from "./api/auth";
import { getUserByEmail } from "./api/fauna";
import { sendConfirmationEmail } from "./api/confirm";
import { UserContext } from "../contexts/userContext";

export default function Signup() {
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { userExists, storeUser, setAuth } = useContext(UserContext);
  const handleLogin = (event) => {
    if (event) event.preventDefault();
    setStatus("Authenticating...");
    login(email, password).then(
      (res) => {
        setStatus("Login succeeded!");
        setAuth(true);
        console.log("res.instance.value", res.instance.value);
        const id = res.instance.value.id;
        storeUser({
          id,
          secret: res.secret,
          email,
        });
        console.log("conf", id, email);
        sendConfirmationEmail(id, email);
        getUserByEmail(email).then(
          (data) => {
            console.log("getUserByEmail", data);
            storeUser({
              username: data.userByEmail.username,
              confirmed: data.userByEmail.confirmed,
            });
            Router.push("/dashboard");
          },
          (err) => {
            setStatus(`Login failed: ${err}`);
          }
        );
      },
      (err) => {
        setStatus(`Login failed: ${err}`);
      }
    );
  };
  const handleSignUp = (event) => {
    if (event) event.preventDefault();
    setStatus("Creating account...");
    signup(email, username, password).then(
      (res) => {
        handleLogin();
      },
      (err) => {
        setStatus(`Signup failed: ${err}`);
      }
    );
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
  };
  const handleChangeUsername = (event) => {
    setUsername(event.target.value.toLowerCase());
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  useEffect(() => {
		console.log('useEffect')
    if (userExists()) {
      // User is already logged in
      Router.push("/dashboard");
    }
  });

  return (
    <div className="login">
			{console.log('fucking RENDERRRR')}
      <div className="login__box">
        <div className="login__box__content">
          <form>
            <div className="icon-container">
              <img className="icon--large" src="../images/icon-small.png" />
              <h3 className="login__box--title">Affilas</h3>
            </div>
            <h4 className="login__box--subtitle">
              Create your Affilas account
            </h4>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={handleChangeEmail}
            />

            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChangeUsername}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChangePassword}
            />

            {status && <p>{status}</p>}

            <Button fn={handleSignUp} text="Sign up" />
          </form>
        </div>
      </div>
      <p>
        Already have an account?{" "}
        <Link href="/login">
          <a>Log in</a>
        </Link>
      </p>
    </div>
  );
}
