import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";

const UserPopup = () => {
  const {
    editingResume,
    setWarning,
    userMadeChanges,
    setUserMadeChanges,
    storeResume,
    resetPopups,
    storeStatus,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [title, setTitle] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeJobTitle = (event) => {
    setJobTitle(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeBio = (event) => {
    setBio(event.target.value);
    setUserMadeChanges(true);
  };
  const validateInput = () => {
    if (!title) return "Please provide a resume title";
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
      title,
      jobTitle,
      bio,
    };

    storeResume(myData, {});

    fauna({
      type: "UPDATE_RESUME",
      id: editingResume._id,
      data: myData,
    }).then(
      () => storeStatus("Saved."),
      (err) => storeStatus("Error: failed to save", err)
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

      setTitle(editingResume.title);
      setJobTitle(editingResume.jobTitle);
      setBio(editingResume.bio);
    }
  });
  return (
    <div className="popup-container" onClick={handleCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4>Update info</h4>
        <form>
          <div>
            <label>Resume Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChangeTitle}
            />

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
      </div>
    </div>
  );
};

export default UserPopup;
