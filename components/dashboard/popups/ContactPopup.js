import React, { useState, useEffect, useContext } from "react";
import {
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
} from "../../../pages/api/fauna";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Contactpicker from "../../general/Contactpicker";

export default () => {
  const {
    editingResume,
    setWarning,
    userMadeChanges,
    setUserMadeChanges,
    storeContactInfo,
    resetPopups,
    editingContactInfo,
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
  const handleCreate = async () => {
    const validate = validateInput();
    if (validate) {
      setStatus(validate);
      return;
    }

    await createContactInfo(editingResume._id, {
      name,
      value,
      priority: editingResume.contactInfo.data.length + 1,
    }).then(
      (data) => {
        storeContactInfo(data.createContactInfo, { add: true });
        resetPopups();
      },
      (err) => {
        console.error("createContactInfo err:", err);
      }
    );
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
        console.error("updateContactInfo err:", err);
      }
    );
  };
  const handleDelete = async (event) => {
    if (event) event.preventDefault();
    setWarning({
      text: "Are you sure you want to delete this item?",
      fn: async () => {
        await deleteContactInfo(editingContactInfo._id).then(
          async (data) => {
            storeContactInfo(data.deleteContactInfo, { del: true });
            resetPopups();
            // Propagate priority updates
            for (var item of editingResume.contactInfo.data) {
              if (item.priority > data.deleteContactInfo.priority) {
                const newPriority = item.priority - 1;
                updateContactInfo(item._id, { priority: newPriority });
                storeContactInfo({ ...item, priority: newPriority }, {});
              }
            }
          },
          (err) => {
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

            {status && <p>{status}</p>}

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
