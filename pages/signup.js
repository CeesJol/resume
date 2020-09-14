import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "../components/general/Button";
import { UserContext } from "../contexts/userContext";
import { toast } from "react-toastify";
import { send, fauna } from "../lib/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { userExists, storeUser, setAuth } = useContext(UserContext);
  const handleLogin = async (event) => {
    if (event) event.preventDefault();
    await fauna({ type: "LOGIN_USER", email, password }).then(
      async (data) => {
        setAuth(true);
        send({ type: "SEND_CONFIRMATION_EMAIL", id, email });
        console.log("getUserByEmail", data);
        storeUser(data);
        const id = data._id;
        localStorage.setItem("userId", JSON.stringify(id));
        storeUser({ id });
        Router.push("/dashboard");
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("(Signup) login err", err);
      }
    );
  };
  const handleSignUp = async (event) => {
    if (event) event.preventDefault();
    await fauna({ type: "CREATE_USER", email, username, password }).then(
      async () => {
        await handleLogin();
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
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
