import React, { useState, useEffect, useContext } from "react";
import { updateResume, readUser } from "../../../pages/api/fauna";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toast } from "react-toastify";

const UserPopup = () => {
  const {
    editingResume,
    setWarning,
    userMadeChanges,
    setUserMadeChanges,
    storeResume,
    resetPopups,
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
  const handleUpdate = async () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    await updateResume(editingResume._id, {
			title,
      jobTitle,
      bio,
    }).then(
      (data) => {
        storeResume(data.updateResume, {});
        resetPopups();
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.log("updateResume err:", err);
      }
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
