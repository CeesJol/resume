import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Contactpicker from "../../general/Contactpicker";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";

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
    updateContactInfo,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
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
  const handleCreate = async () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    await fauna({
      type: "CREATE_CONTACT_INFO",
      resumeId: editingResume._id,
      data: {
        name,
        value,
        priority: getContactInfo().length + 1,
      },
    }).then(
      (data) => {
        storeContactInfo(data.createContactInfo, { add: true });
        resetPopups();
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("createContactInfo err:", err);
      }
    );
  };
  const handleUpdate = async () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    await fauna({
      type: "UPDATE_CONTACT_INFO",
      id: editingContactInfo._id,
      data: {
        name,
        value,
      },
    }).then(
      (data) => {
        storeContactInfo(data.updateContactInfo, {});
        resetPopups();
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("updateContactInfo err:", err);
      }
    );
  };
  const handleDelete = async (event) => {
    if (event) event.preventDefault();
    setWarning({
      text: "Are you sure you want to delete this item?",
      fn: async () => {
        await fauna({
          type: "DELETE_CONTACT_INFO",
          id: editingContactInfo._id,
        }).then(
          async (data) => {
            storeContactInfo(editingContactInfo, { del: true });
            resetPopups();
            // Propagate priority updates
            for (var item of getContactInfo()) {
              if (item.priority > editingContactInfo.priority) {
                const newPriority = item.priority - 1;
                storeContactInfo({ ...item, priority: newPriority }, {});
              }
            }
          },
          (err) => {
            toast.error(`⚠️ ${err}`);
            console.error("deleteContactInfo err:", err);
          }
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
