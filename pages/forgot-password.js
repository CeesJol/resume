import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "../components/general/Button";
import { UserContext } from "../contexts/userContext";
import { toast } from "react-toastify";
import { fauna, send } from "../lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [pressedButton, setPressedButton] = useState(false);
  const { userExists, setLoggingOut } = useContext(UserContext);
  const handleForgotPassword = async (event) => {
    if (event) event.preventDefault();
    // Check if account with that email exists
    const data = await fauna({ type: "CHECK_USER_EMAIL", email });

    setPressedButton(true);

    if (!data.userByEmail.email) {
      // Account does not exist
      return;
    }

    const id = data.userByEmail._id;

    // Send reset link
    await send({ type: "SEND_RESET_LINK", id, email }).then(
      () => {},
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("login err", err);
      }
    );
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
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
            {pressedButton ? (
              <h4 className="login__box--subtitle">
                Check your email address, <b>{email}</b>, for instructions from
                us on how to reset your password.
              </h4>
            ) : (
              <>
                <h4 className="login__box--subtitle">
                  To reset your password, enter the email address you use to
                  sign in.
                </h4>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChangeEmail}
                />

                <Button
                  fn={handleForgotPassword}
                  text="Get reset link"
                  altText="Loading..."
                />
              </>
            )}
          </form>
        </div>
      </div>
      <p>
        Back to{" "}
        <Link href="/login">
          <a>login</a>
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
