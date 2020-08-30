import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Contactpicker from "../../general/Contactpicker";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";
import randomId from "../../../lib/randomId";
import { CONTACTPICKER_OPTIONS } from "../../../lib/constants";

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
      priority: getContactInfo().length + 1,
    };

    storeContactInfo(myData, { add: true });

    fauna({
      type: "CREATE_CONTACT_INFO",
      resumeId: editingResume._id,
      data: myData,
    }).then(
      (data) => {
        storeContactInfo(
          { _id: tempId },
          { newId: data.createContactInfo._id }
        );
        storeStatus("Saved.");
      },
      (err) => storeStatus("Error: failed to save", err)
    );
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

    fauna({
      type: "UPDATE_CONTACT_INFO",
      id: editingContactInfo._id,
      data: myData,
    }).then(
      () => storeStatus("Saved."),
      (err) => storeStatus("Error: failed to save", err)
    );
  };
  const handleDelete = (event) => {
    if (event) event.preventDefault();
    setWarning({
      text: "Are you sure you want to delete this item?",
      fn: () => {
        storeContactInfo(editingContactInfo, { del: true });
        resetPopups();
        // Propagate priority updates
        for (var item of getContactInfo()) {
          if (item.priority > editingContactInfo.priority) {
            const newPriority = item.priority - 1;
            storeContactInfo({ ...item, priority: newPriority }, {});
          }
        }

        fauna({
          type: "DELETE_CONTACT_INFO",
          id: editingContactInfo._id,
        }).then(
          () => storeStatus("Saved."),
          (err) => storeStatus("Error: failed to save", err)
        );
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
    if (editingContactInfo.name && !filled) {
      setFilled(true);

      setName(editingContactInfo.name);
      if (CONTACTPICKER_OPTIONS[value]) {
        setValue(editingContactInfo.value);
      } else {
        setValue("");
        setCustomValue(editingContactInfo.value);
      }
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

            {value == "" && (
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
      </div>
    </div>
  );
};

export default ContactPopup;
