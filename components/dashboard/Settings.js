import React, { useState, useEffect, useContext } from "react";
import Button from "../general/Button";
import { updateUser } from "../../pages/api/fauna";
import { updatePassword } from "../../pages/api/auth";
import { disconfirmUser, sendConfirmationEmail } from "../../pages/api/confirm";
import { UserContext } from "../../contexts/userContext";
import { validateUpdate, validatePassword } from "../../lib/validate";

export default () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [status2, setStatus2] = useState("");
  const { storeUser, getUser } = useContext(UserContext);
  const handleChangeUsername = (event) => {
    setUsername(event.target.value.toLowerCase());
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
  };
  const handleChangeWebsite = (event) => {
    setWebsite(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleSave = async (event) => {
    if (event) event.preventDefault();
    const validationError = validateUpdate(username, email, website);
    if (validationError) {
      setStatus(validationError);
      return;
    }
    const user = getUser();
    await updateUser(user.id, username, email, website).then(
      (data) => {
        if (data == -1) {
          setStatus("That username or email is already taken");
          return;
        }

				// If email changed, set confirmed to false and 
				// send a new confirmation email
        if (email !== user.email) {
          disconfirmUser(user.id);
          sendConfirmationEmail(user.id, email);
          console.log("user disconfirmed");
        }

        // Update user locally
        storeUser({
          username: data.updateUser.username,
          email: data.updateUser.email,
          website: data.updateUser.website,
        });

        setStatus("Updated successfully!");
      },
      (err) => {
        console.log("err", err);
      }
    );
  };
  const handleSavePassword = async (event) => {
    if (event) event.preventDefault();
    const validationError = validatePassword(password);
    if (validationError) {
      setStatus2(validationError);
      return false;
    }
    await updatePassword(getUser().id, password).then(
      (data) => {
        setStatus2("Updated successfully!");
      },
      (err) => {
        setStatus2("Something went wrong at our side. Please try again later!");
        console.log("err", err);
      }
    );
  };
  useEffect(() => {
    if (!username && !email) {
      const user = getUser();
      setUsername(user.username);
      setEmail(user.email);
      setWebsite(user.website ? user.website : "");
    }
  });

  return (
    <>
      <div className="dashboard__settings">
        <h4 className="dashboard__settings--title">Your information</h4>
        <form>
          <label>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChangeUsername}
          />

          <label>E-mail address</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={handleChangeEmail}
          />

          <label>Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={website}
            onChange={handleChangeWebsite}
          />

          {status && <p>{status}</p>}

          <Button text="Save" fn={handleSave} />
        </form>
      </div>

      <div className="dashboard__settings">
        <h4 className="dashboard__settings--title">Change password</h4>
        <form>
          <label>New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChangePassword}
          />

          {status2 && <p>{status2}</p>}

          <Button text="Save" fn={handleSavePassword} />
        </form>
      </div>
    </>
  );
};
