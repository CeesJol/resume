import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Contactpicker from "../../dashboard/pickers/Contactpicker";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";
import randomId from "../../../lib/randomId";
import { CONTACTPICKER_OPTIONS } from "../../../lib/constants";
import ReactModal from "react-modal";
ReactModal.setAppElement("#__next");

const ContactPopup = () => {
  const {
    editingResume,
    setWarning,
    userMadeChanges,
    setUserMadeChanges,
    storeContactInfo,
    resetPopups,
    editingContactInfo,
    getContactInfo,
    storeStatus,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [name, setName] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [value, setValue] = useState("Email");
  const handleChangeName = (event) => {
    setName(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeCustomValue = (event) => {
    setCustomValue(event.target.value);
  };
  const handleChangeValue = (event) => {
    setValue(event.target.value);
  };
  const validateInput = () => {
    if (!name) return "Please provide a contact details";
    return false;
  };
  const handleCreate = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    const tempId = randomId();
    const myData = {
      _id: tempId,
      name,
      value: value ? value : customValue,
    };

    storeContactInfo(myData, { add: true });
  };
  const handleUpdate = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    const myData = {
      ...editingContactInfo,
      name,
      value: value ? value : customValue,
    };

    storeContactInfo(myData, {});
  };
  const handleDelete = (event) => {
    if (event) event.preventDefault();
    setWarning({
      text: "Are you sure you want to delete this item?",
      fn: () => {
        storeContactInfo(editingContactInfo, { del: true });
        resetPopups();
      },
    });
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
    if (editingContactInfo.title && !filled) {
      setFilled(true);

      setName(editingContactInfo.title);
      if (CONTACTPICKER_OPTIONS[value]) {
        setValue(editingContactInfo.value);
      } else {
        setValue("");
        setCustomValue(editingContactInfo.value);
      }
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
          <label>Type</label>
          <Contactpicker val={value} fn={handleChangeValue} />

          {value === "" && (
            <>
              <label>Contact type</label>
              <input
                type="text"
                id="customValue"
                name="customValue"
                value={customValue}
                onChange={handleChangeCustomValue}
              />
            </>
          )}

          <label>Contact information</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChangeName}
          />

          {editingContactInfo.title ? (
            <>
              <Button text="Update" altText="Updating..." fn={handleUpdate} />
              <Button
                text="Delete"
                altText="Deleting..."
                color="red"
                fn={handleDelete}
              />
            </>
          ) : (
            <Button text="Add" altText="Adding..." fn={handleCreate} />
          )}
        </div>
      </form>
    </ReactModal>
  );
};

export default ContactPopup;
