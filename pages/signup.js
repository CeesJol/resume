import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "../components/general/Button";
import { login, signup } from "./api/auth";
import { getUserByEmail } from "./api/fauna";
import { sendConfirmationEmail } from "./api/confirm";
import { UserContext } from "../contexts/userContext";
import { toast } from "react-toastify";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { userExists, storeUser, setAuth } = useContext(UserContext);
  const handleLogin = (event) => {
    if (event) event.preventDefault();
    login(email, password).then(
      (res) => {
        setAuth(true);
        console.log("res.instance.value", res.instance.value);
        const id = res.instance.value.id;
        storeUser({
          id,
          secret: res.secret,
          email,
        });
        sendConfirmationEmail(id, email);
        getUserByEmail(email).then(
          (data) => {
            console.log("getUserByEmail", data);
            storeUser(data.userByEmail);
            Router.push("/dashboard");
          },
          (err) => {
            console.error("signup err", err);
            toast.error("⚠️ Login failed");
          }
        );
      },
      (err) => {
        console.error("(Signup) login err", err);
        toast.error("⚠️ Login failed");
      }
    );
  };
  const handleSignUp = (event) => {
    if (event) event.preventDefault();
    signup(email, username, password).then(
      (res) => {
        handleLogin();
      },
      (err) => {
        toast.error("⚠️ Signup failed");
        console.log("signup err", err);
      }
    );
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
  };
  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  useEffect(() => {
		if (Router.query["email"]) {
			setEmail(Router.query["email"]);
		}
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

            <Button fn={handleSignUp} text="Sign up" altText="Signing up..." />
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
