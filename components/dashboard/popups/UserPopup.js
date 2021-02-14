import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toastError } from "../../../lib/error";
import PLACEHOLDER from "../../../lib/placeholder";
import ReactModal from "react-modal";
import CloseButton from "../CloseButton";
ReactModal.setAppElement("#__next");

const UserPopup = () => {
  const {
    editingResume,
    setWarning,
    userMadeChanges,
    setUserMadeChanges,
    updateResume,
    resetPopups,
  } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");
  const handleChangeJobTitle = (event) => {
    setJobTitle(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeBio = (event) => {
    setBio(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
    setUserMadeChanges(true);
  };
  const validateInput = () => {
    if (!username) return "Please provide your name";
    // Job title is mandatory, bio is not
    if (!jobTitle) return "Please provide a job title";
    return false;
  };
  const checkInvalidInput = () => {
    const validationError = validateInput();
    if (validationError) {
      toastError(validationError);
      return true;
    }
    return false;
  };
  const handleUpdate = () => {
    if (checkInvalidInput()) return;

    const myData = {
      _id: editingResume._id,
      username,
      jobTitle,
      bio,
    };

    updateResume(myData);
  };
  const handleCancel = () => {
    if (userMadeChanges) {
      setWarning({
        text:
          "Are you sure you want to cancel editing? All unsaved changes will be lost.",
      });
    } else {
      resetPopups();
    }
  };
  useEffect(() => {
    setUsername(editingResume.username);
    setJobTitle(editingResume.jobTitle);
    setBio(editingResume.bio);
  }, []);
  return (
    <ReactModal
      className="popup"
      isOpen={true}
      overlayClassName="popup-container"
      onRequestClose={handleCancel}
    >
      <div className="popup__header">
        <h4 className="popup__header--title">Update info</h4>
        <CloseButton fn={handleCancel} />
      </div>
      <form>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChangeUsername}
            placeholder={PLACEHOLDER.name}
          />

          <label>Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={jobTitle}
            onChange={handleChangeJobTitle}
            placeholder={PLACEHOLDER.jobTitle}
          />

          <label>Professional Summary</label>
          <textarea
            type="text"
            id="bio"
            name="bio"
            value={bio}
            onChange={handleChangeBio}
            placeholder={PLACEHOLDER.bio}
          />

          <Button text="Update" altText="Updating..." fn={handleUpdate} />
        </div>
      </form>
    </ReactModal>
  );
};

export default UserPopup;
