import React, { useState, useEffect, useContext } from "react";
import { updateResume, readUser } from "../../../pages/api/fauna";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Monthpicker from "../../general/Monthpicker";
import Yearpicker from "../../general/Yearpicker";

export default () => {
  const {
    getUser,
    storeUser,
    editingResume,
    setEditingResume,
    warning,
    setWarning,
    setChangingInfo,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");
  const handleChangeJobTitle = (event) => {
    setJobTitle(event.target.value);
  };
  const handleChangeBio = (event) => {
    setBio(event.target.value);
  };
  const validateInput = () => {
    if (!jobTitle) return "Please provide a job title";
    if (!bio) return "Please provide a bio";
    return false;
  };
  const handleUpdate = async () => {
    const validate = validateInput();
    if (validate) {
      setStatus(validate);
      return;
    }

    console.log("editingResume", editingResume);
    await updateResume(editingResume._id, {
      jobTitle,
      bio,
    }).then(
      async () => {
        await readUser(getUser().id).then(
          (res) => {
            storeUser(res.findUserByID);
            setChangingInfo(false);
          },
          (err) => {
            console.log("readUser res ERR", err);
          }
        );
      },
      (err) => {
        console.log("updateResume err:", err);
      }
    );
  };
  const handleCancel = () => {
    setWarning({
      text:
        "Are you sure you want to cancel editing? All unsaved changes will be lost.",
    });
  };
  useEffect(() => {
    if (!filled) {
      setFilled(true);

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

            {status && <p>{status}</p>}

            <Button text="Update" altText="Updating..." fn={handleUpdate} />
          </div>
        </form>
      </div>
    </div>
  );
};
