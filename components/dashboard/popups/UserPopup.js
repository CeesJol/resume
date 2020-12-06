import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";
import ReactModal from "react-modal";
ReactModal.setAppElement("#__next");

const UserPopup = () => {
  const {
    editingResume,
    setWarning,
    userMadeChanges,
    setUserMadeChanges,
    updateResume,
    resetPopups,
    storeStatus,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
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
  const handleUpdate = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    const myData = {
      _id: editingResume._id,
      jobTitle,
      bio,
    };

    updateResume(myData);

    fauna({
      type: "UPDATE_RESUME",
      id: editingResume._id,
      data: myData,
    }).then(
      () => storeStatus("Saved."),
      (err) => storeStatus(`Error: failed to save: ${err}`)
    );
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
    if (!filled) {
      setFilled(true);

      setJobTitle(editingResume.jobTitle);
      setBio(editingResume.bio);
    }
  });
  return (
    <ReactModal
      className="popup"
      isOpen={true}
      overlayClassName="popup-container"
      onRequestClose={handleCancel}
    >
      <div className="popup__header">
        <h4 className="popup__header--title">Update info</h4>
        <i
          onClick={handleCancel}
          className={`fa fa-close popup__header--close`}
        ></i>
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
