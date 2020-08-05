import React, { useState, useEffect, useContext } from "react";
import { updateContactInfo, readUser } from "../../../pages/api/fauna";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Contactpicker from "../../general/Contactpicker";

export default () => {
  const {
    getUser,
    storeUser,
    editingResume,
    setEditingResume,
    warning,
    setWarning,
    setChangingInfo,
    userMadeChanges,
    setUserMadeChanges,
    storeContactInfo,
    resetPopups,
    editingContactInfo,
    setEditingContactInfo,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const handleChangeName = (event) => {
    setName(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeValue = (event) => {
    setValue(event.target.value);
    setUserMadeChanges(true);
  };
  const validateInput = () => {
    if (!name) return "Please provide a job title";
    return false;
  };
  const handleUpdate = async () => {
    const validate = validateInput();
    if (validate) {
      setStatus(validate);
      return;
    }

    await updateContactInfo(editingContactInfo._id, {
      name,
      value,
    }).then(
      (data) => {
        storeContactInfo(data.updateContactInfo, {});
        resetPopups();
      },
      (err) => {
        console.log("updateContactInfo err:", err);
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
    if (editingContactInfo.name && !filled) {
      setFilled(true);

      setName(editingContactInfo.name);
      setValue(editingContactInfo.value);
    }
  });
  return (
    <div className="popup-container" onClick={handleCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4>Update info</h4>
        <form>
          <div>
            <label>Type</label>
            <Contactpicker val={value} fn={handleChangeValue} />

            <label>Contact information</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChangeName}
            />

            {status && <p>{status}</p>}

            <Button text="Update" altText="Updating..." fn={handleUpdate} />
          </div>
        </form>
      </div>
    </div>
  );
};
