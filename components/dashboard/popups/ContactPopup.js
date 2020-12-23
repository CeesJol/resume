import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Contactpicker from "../../dashboard/pickers/Contactpicker";
import { toast } from "react-toastify";
import randomId from "../../../lib/randomId";
import { CONTACTPICKER_OPTIONS } from "../../../lib/constants";
import ReactModal from "react-modal";
import CloseButton from "../CloseButton";
ReactModal.setAppElement("#__next");

const ContactPopup = () => {
  const {
    setWarning,
    userMadeChanges,
    setUserMadeChanges,
    createContactInfo,
    deleteContactInfo,
    updateContactInfo,
    resetPopups,
    editingContactInfo,
  } = useContext(UserContext);
  const [name, setName] = useState("Email");
  const [customName, setCustomName] = useState("");
  const [value, setValue] = useState("");
  const [link, setLink] = useState("");
  const [useLink, setUseLink] = useState(true);
  const handleChangeValue = (event) => {
    if (useLink && value === link) {
      // Set link equal to value
      setLink(event.target.value);
    }
    setValue(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeCustomName = (event) => {
    setCustomName(event.target.value);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeLink = (event) => {
    setLink(event.target.value);
  };
  const handleChangeUseLink = () => {
    setUseLink(!useLink);
  };
  const validateInput = () => {
    if (!value) return "Please provide contact information";

    // Validate link, if applicable
    if (useLink) {
      if (link === "") {
        return "Please provide a link, or disable it";
      }
      // Email
      if (name === "Email") {
        if (!link.startsWith("mailto:")) {
          return "Email links should start with mailto:";
        }
        return false;
      }
      if (name === "Phone number") {
        if (!link.startsWith("tel:")) {
          return "Phone number links should start with tel:";
        }
        return false;
      }
      // URL
      if (!(link.startsWith("http://") || link.startsWith("https://"))) {
        return "Links should start with http:// or https://";
      }
    }

    return false;
  };
  const handleCreate = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    const myData = {
      id: randomId(),
      name: name ? name : customName,
      value,
      link: useLink ? link : "",
    };

    createContactInfo(myData);
  };
  const handleUpdate = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    const myData = {
      ...editingContactInfo,
      name: name ? name : customName,
      value,
      link: useLink ? link : "",
    };

    updateContactInfo(myData);
  };
  const handleDelete = (event) => {
    if (event) event.preventDefault();
    setWarning({
      text: "Are you sure you want to delete this item?",
      fn: () => {
        deleteContactInfo(editingContactInfo);
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
    if (editingContactInfo.name) {
      setName(editingContactInfo.name);
      setLink(editingContactInfo.link);
      setUseLink(editingContactInfo.link !== "");
      if (CONTACTPICKER_OPTIONS[value]) {
        setValue(editingContactInfo.value);
      } else {
        setValue("");
        setCustomValue(editingContactInfo.value);
      }
    }
  }, []);
  return (
    <ReactModal
      className="popup"
      isOpen={true}
      overlayClassName="popup-container"
      onRequestClose={handleCancel}
    >
      <div className="popup__header">
        <h4 className="popup__header--title">
          {editingContactInfo.name ? "Update item" : "Create item"}
        </h4>
        <CloseButton fn={handleCancel} />
      </div>
      <form>
        <div>
          <label>Type</label>
          <Contactpicker val={name} fn={handleChangeName} />

          {name === "" && (
            <>
              <label>Contact type</label>
              <input
                type="text"
                id="customName"
                name="customName"
                value={customName}
                onChange={handleChangeCustomName}
              />
            </>
          )}

          <label>Contact information</label>
          <input
            type="text"
            id="value"
            name="value"
            value={value}
            onChange={handleChangeValue}
          />

          <label>
            <input
              name="useLink"
              id="useLink"
              type="checkbox"
              checked={useLink}
              onChange={handleChangeUseLink}
            />
            Use link
          </label>

          {useLink && (
            <>
              <label>Link</label>
              <input
                type="text"
                id="link"
                name="link"
                value={link}
                onChange={handleChangeLink}
              />
            </>
          )}

          {editingContactInfo.value ? (
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
