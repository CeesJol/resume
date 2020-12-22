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
  const [name, setName] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [value, setValue] = useState("Email");
  const [link, setLink] = useState("");
  const [useLink, setUseLink] = useState(true);
  const handleChangeName = (event) => {
    if (useLink && name === link) {
      // Set link equal to name
      setLink(event.target.value);
    }
    setName(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeCustomValue = (event) => {
    setCustomValue(event.target.value);
  };
  const handleChangeValue = (event) => {
    setValue(event.target.value);
  };
  const handleChangeLink = (event) => {
    setLink(event.target.value);
  };
  const handleChangeUseLink = () => {
    setUseLink(!useLink);
  };
  const validateInput = () => {
    if (!name) return "Please provide a contact details";

    // Validate link, if applicable
    if (useLink) {
      if (link === "") {
        return "Please provide a link, or disable it";
      }
      // Email
      if (value === "Email") {
        if (!link.startsWith("mailto:")) {
          return "Email links should start with mailto:";
        }
        return false;
      }
      if (value === "Phone number") {
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
      name,
      value: value ? value : customValue,
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
      name,
      value: value ? value : customValue,
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

          {editingContactInfo.name ? (
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
