import React, { useState, useEffect, useContext } from "react";
import {
  updateCategory,
  createCategory,
  deleteCategory,
} from "../../../pages/api/fauna";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";

const CategoryPopup = () => {
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
    getCategories,
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
  const handleCreate = async () => {
    const validate = validateInput();
    if (validate) {
      setStatus(validate);
      return;
    }

    const resumeId = editingResume._id;
    await createCategory(resumeId, {
      name,
      priority: getCategories().length + 1,
    }).then(
      async (data) => {
        storeCategory(data.createCategory, { add: true });
        resetPopups();
        forceRender();
      },
      (err) => {
        console.error("createCategory err:", err);
      }
    );
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
        console.error("updateCategory err:", err);
      }
    );
  };
  const handleDelete = async (event) => {
    if (event) event.preventDefault();
    setWarning({
      text:
        "Are you sure you want to delete this category? All the items in it will be lost.",
      fn: async () => {
        await deleteCategory(editingCategory._id).then(
          async (data) => {
            storeCategory(data.deleteCategory, { del: true });
            resetPopups();
            // Propagate priority updates
            for (var category of getCategories()) {
              if (category.priority > data.deleteCategory.priority) {
                const newPriority = category.priority - 1;
                updateCategory(category._id, { priority: newPriority });
                storeCategory({ ...category, priority: newPriority }, {});
              }
            }
          },
          (err) => {
            console.error("deleteCategory err:", err);
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

            {editingCategory.name ? (
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

export default CategoryPopup;
