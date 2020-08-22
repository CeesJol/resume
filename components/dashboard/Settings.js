import React, { useState, useEffect, useContext } from "react";
import Button from "../general/Button";
import { UserContext } from "../../contexts/userContext";
import { validateUpdate, validatePassword } from "../../lib/validate";
import { toast } from "react-toastify";
import { send, fauna, auth } from "../../lib/api";

const Settings = () => {
  const { storeUser, getUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [password, setPassword] = useState("");
  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
  };
  const handleChangeJobTitle = (event) => {
    setJobTitle(event.target.value);
  };
  const handleChangeBio = (event) => {
    setBio(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleSave = async (event) => {
    if (event) event.preventDefault();
    const validationError = validateUpdate(username, email);
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }
    const user = getUser();
    await fauna({
      type: "UPDATE_USER",
      id: user._id,
      data: {
        username,
        email,
        jobTitle,
        bio,
      },
    }).then(
      (data) => {
        if (data == -1) {
          toast.error("⚠️ That email is already taken");
          return;
        }

        // If email changed, set confirmed to false and
        // send a new confirmation email
        if (email !== user.email) {
          fauna({
            type: "UPDATE_USER",
            id: user._id,
            data: { confirmed: false },
          });
          send({ type: "SEND_CONFIRMATION_EMAIL", id: user._id, email });
          console.log("user disconfirmed");
        }

        // Update user locally
        storeUser({
          username: data.updateUser.username,
          email: data.updateUser.email,
          jobTitle: data.updateUser.jobTitle,
          bio: data.updateUser.bio,
        });

        toast.success("💾 Updated successfully!");
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("err", err);
      }
    );
  };
  const handleSavePassword = async (event) => {
    if (event) event.preventDefault();
    const validationError = validatePassword(password);
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return false;
    }
    await fauna({
      type: "UPDATE_USER_PASSWORD",
      id: getUser()._id,
      password,
    }).then(
      () => {
        toast.success("💾 Updated successfully!");
      },
      (err) => {
        toast.error(
          "⚠️ Something went wrong at our side. Please try again later!"
        );
        console.error("err", err);
      }
    );
  };
  useEffect(() => {
    if (!username && !email) {
      const user = getUser();
      setUsername(user.username);
      setEmail(user.email);
      setJobTitle(user.jobTitle ? user.jobTitle : "");
      setBio(user.bio ? user.bio : "");
    }
  });

  return (
    <>
      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Your information</h4>
        <form>
          <label>Name</label>
          <input
            type="text"
            id="username"
            name="name"
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

          <label>Job title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={jobTitle}
            onChange={handleChangeJobTitle}
          />

          <label>Bio</label>
          <textarea
            type="text"
            id="bio"
            name="bio"
            value={bio}
            onChange={handleChangeBio}
          />

          <label>
            <i>
              Your job title and bio will be used when creating a new resume.
            </i>
          </label>

          <Button text="Save" altText="Saving..." fn={handleSave} />
        </form>
      </div>

      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Change password</h4>
        <form>
          <label>New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChangePassword}
          />

          <Button text="Save" altText="Saving..." fn={handleSavePassword} />
        </form>
      </div>
    </>
  );
};

export default Settings;
