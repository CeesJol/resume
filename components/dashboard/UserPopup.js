import React, { useState, useEffect, useContext } from "react";
import {
	updateResume,
  readUser,
} from "../../pages/api/fauna";
import { UserContext } from "../../contexts/userContext";
import { DashboardContext } from "../../contexts/dashboardContext";
import Button from "../general/Button";
import Monthpicker from "../general/Monthpicker";
import Yearpicker from "../general/Yearpicker";

export default () => {
  const { getUser, storeUser } = useContext(UserContext);
  const { editingResume, setEditingResume } = useContext(
    DashboardContext
  );
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

		console.log('editingResume', editingResume)
    await updateResume(editingResume._id, {
			jobTitle,
			bio
    }).then(
      async () => {
        await readUser(getUser().id).then(
          (res) => {
            storeUser(res.findUserByID);
            setEditingResume({ ...editingResume, changingInfo: false });
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
  useEffect(() => {
    if (!filled) {
      setFilled(true);

      setJobTitle(editingResume.jobTitle);
      setBio(editingResume.bio);
    }
  });
  return (
    <div className="popup-container">
      <div className="popup">
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
            <input
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
