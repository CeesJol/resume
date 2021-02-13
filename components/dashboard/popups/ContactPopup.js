import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Contactpicker from "../../dashboard/pickers/Contactpicker";
import { toastError } from "../../../lib/error";
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
    getUnusedContactOptions,
  } = useContext(UserContext);
  const [name, setName] = useState("");
  const [customName, setCustomName] = useState("");
  const [value, setValue] = useState("");
  const [link, setLink] = useState("");
  const [useLink, setUseLink] = useState(false);
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
    if (!useLink) {
      // Set link equal to value
      // TODO replace with a function that adds https:// or mailto: or whatever
      setLink(value);
    }
    setUseLink(!useLink);
  };
  const validateInput = () => {
    if (!value) return "Please provide contact information";

    return false;
  };
  const convertToAbsoluteUrl = (url) => {
    if (name === "Email" && !url.startsWith("mailto:")) {
      return `mailto:${url}`;
    }
    if (name === "Phone number" && !url.startsWith("tel:")) {
      return `tel:${url}`;
    }
    if (!(url.startsWith("http:") || url.startsWith("https:"))) {
      return `http://${url}`;
    }
    return url;
  };
  const convertToRelativeUrl = (url) => {
    let result = url;
    if (url.startsWith("mailto:")) {
      result = url.substring(7);
    } else if (url.startsWith("tel:")) {
      result = url.substring(4);
    } else if (url.startsWith("http:")) {
      result = url.substring(5);
    } else if (url.startsWith("https:")) {
      result = url.substring(6);
    }
    if (result.startsWith("//")) result = result.substring(2);
    return result;
  };
  const getData = () => ({
    name: name ? name : customName,
    value,
    link: useLink ? convertToAbsoluteUrl(link) : "",
  });
  const handleCreate = () => {
    const validationError = validateInput();
    if (validationError) {
      toastError(validationError);
      return;
    }

    const myData = {
      id: randomId(),
      ...getData(),
    };

    createContactInfo(myData);
  };
  const handleUpdate = () => {
    const validationError = validateInput();
    if (validationError) {
      toastError(validationError);
      return;
    }

    const myData = {
      ...editingContactInfo,
      ...getData(),
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
      setValue(editingContactInfo.value);
      setLink(convertToRelativeUrl(editingContactInfo.link));
      setUseLink(editingContactInfo.link !== "");
      if (CONTACTPICKER_OPTIONS[name]) {
        setName(editingContactInfo.name);
      } else {
        setName("");
        setCustomName(editingContactInfo.name);
      }
    } else {
      // Set name to first contact option thats unused
      setName(getUnusedContactOptions()[0]);
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
