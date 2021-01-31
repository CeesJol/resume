import React, { useState, useEffect, useContext } from "react";
import Button from "../../general/Button";
import { UserContext } from "../../../contexts/userContext";
import { validateUpdate, validatePassword } from "../../../lib/validate";
import { toast } from "react-toastify";
import { send, fauna } from "../../../lib/api";
import { toastError } from "../../../lib/error";

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
  const checkInvalidInput = () => {
    const validationError = validateUpdate(fields.username, fields.email);
    if (validationError) {
      toastError(validationError);
      return true;
    }
    return false;
  };
  const checkInvalidInputPassword = () => {
    const validationError = validatePassword(fields.password);
    if (validationError) {
      toastError(validationError);
      return true;
    }
    return false;
  };
  const handleSave = async () => {
    if (checkInvalidInput()) return;
    const { password, ...visibleData } = fields;
    await fauna({
      type: "UPDATE_USER",
      id: user._id,
      data: visibleData,
    }).then(
      (data) => {
        if (data === -1) {
          toastError("That email is already taken");
          return;
        }

        // If email changed, set confirmed to false and
        // send a new confirmation email
        // TODO is there a bug here?
        if (fields.email !== user.email) {
          fauna({
            type: "UPDATE_USER",
            id: user._id,
            data: { confirmed: false },
          });
          send({ type: "SEND_CONFIRMATION_EMAIL", id: user._id, email });
          console.info("user disconfirmed");
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
        toastError(err);
        console.error("err", err);
      }
    );
  };
  const handleSavePassword = async () => {
    if (checkInvalidInputPassword()) return;
    await fauna({
      type: "UPDATE_USER_PASSWORD",
      id: user._id,
      password: fields.password,
    }).then(
      () => {
        toast.success("💾 Updated successfully!");
      },
      (err) => {
        toastError("Something went wrong at our side. Please try again later!");
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
  }, []);
  return (
    <>
      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Your information</h4>
        <form>
          <label>Name</label>
          <input
            type="text"
            id="username"
            name="username"
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

          <label>Professional summary</label>
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
