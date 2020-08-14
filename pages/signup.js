import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "../components/general/Button";
import { UserContext } from "../contexts/userContext";
import { toast } from "react-toastify";
import { auth, confirm, fauna } from "../lib/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { userExists, storeUser, setAuth } = useContext(UserContext);
  const handleLogin = (event) => {
    if (event) event.preventDefault();
    auth({ type: "LOGIN", email, password }).then(
      (res) => {
        setAuth(true);
        console.log("res", res);
        const id = res.instance["@ref"].id;
        storeUser({
          id,
          secret: res.secret,
          email,
        });
        confirm({ type: "SEND_CONFIRMATION_EMAIL", id, email });
        fauna({ type: "GET_USER_BY_EMAIL", email }).then(
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
    auth({ type: "SIGNUP", email, username, password }).then(
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

            <label htmlFor="username">Name</label>
            <input
              type="text"
              id="username"
              name="user"
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
};

export default Signup;
