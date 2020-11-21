import React, { useState, useEffect, useContext } from "react";
import Button from "../../general/Button";
import { UserContext } from "../../../contexts/userContext";
import { validateUpdate, validatePassword } from "../../../lib/validate";
import { toast } from "react-toastify";
import { send, fauna } from "../../../lib/api";

const Settings = () => {
  const { storeUser, user } = useContext(UserContext);
  const [fields, setFields] = useState({
    username: "",
    email: "",
    bio: "",
    jobTitle: "",
    password: "",
  });
  const handleChange = (event) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };
  const handleSave = async (event) => {
    if (event) event.preventDefault();
    const validationError = validateUpdate(fields.username, fields.email);
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }
    const { password, ...visibleData } = fields;
    await fauna({
      type: "UPDATE_USER",
      id: user._id,
      data: visibleData,
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
    const validationError = validatePassword(fields.password);
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return false;
    }
    await fauna({
      type: "UPDATE_USER_PASSWORD",
      id: user._id,
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
    if (!fields.username && !fields.email) {
      setFields({
        ...fields,
        username: user.username,
        email: user.email,
        jobTitle: user.jobTitle,
        bio: user.bio,
      });
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
            value={fields.username}
            onChange={handleChange}
          />

          <label>E-mail address</label>
          <input
            type="text"
            id="email"
            name="email"
            value={fields.email}
            onChange={handleChange}
          />

          <label>Job title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={fields.jobTitle}
            onChange={handleChange}
          />

          <label>Bio</label>
          <textarea
            type="text"
            id="bio"
            name="bio"
            value={fields.bio}
            onChange={handleChange}
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
            value={fields.password}
            onChange={handleChange}
          />

          <Button text="Save" altText="Saving..." fn={handleSavePassword} />
        </form>
      </div>
    </>
  );
};

export default Settings;
