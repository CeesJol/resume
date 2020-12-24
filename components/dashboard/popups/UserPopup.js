import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toast } from "react-toastify";
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
  const validateInput = () => {
    if (!jobTitle) return "Please provide a job title";
    if (!bio) return "Please provide a bio";
    return false;
  };
  const checkInvalidInput = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return true;
    }
    return false;
  };
  const handleUpdate = () => {
    if (checkInvalidInput()) return;

    const myData = {
      _id: editingResume._id,
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
          <label>Job Title</label>
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

          <Button text="Update" altText="Updating..." fn={handleUpdate} />
        </div>
      </form>
    </ReactModal>
  );
};

export default UserPopup;
