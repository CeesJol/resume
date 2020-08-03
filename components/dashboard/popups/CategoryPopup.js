import React, { useState, useEffect, useContext } from "react";
import { updateCategory } from "../../../pages/api/fauna";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";

export default () => {
  const {
    getUser,
    storeUser,
    nav,
    editingResume,
    setWarning,
    storeCategory,
    userMadeChanges,
    setUserMadeChanges,
    resetPopups,
    getCategory,
		forceRender,
		editingCategory,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const handleChangeName = (event) => {
    setName(event.target.value);
    setUserMadeChanges(true);
  };
  const validateInput = () => {
    if (!name) return "Please provide a name";
    return false;
  };
  const handleUpdate = async () => {
    const validate = validateInput();
    if (validate) {
      setStatus(validate);
      return;
    }

    const categoryId = editingCategory._id;
    await updateCategory(categoryId, {
      name,
    }).then(
      async (data) => {
        storeCategory(data.updateCategory, {});
				resetPopups();
				forceRender();
      },
      (err) => {
        console.log("updateCategory err:", err);
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
    if (editingCategory.name && !filled) {
      setFilled(true);

      setName(editingCategory.name);
    }
  });
  return (
    <div className="popup-container" onClick={handleCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4>{editingCategory.name ? "Edit category" : "Create category"}</h4>
        <form>
          <div>
            <label>Name</label>
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
