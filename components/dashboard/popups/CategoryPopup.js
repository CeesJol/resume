import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";

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
  const handleChangeName = (event) => {
    setName(event.target.value);
    setUserMadeChanges(true);
  };
  const validateInput = () => {
    if (!name) return "Please provide a name";
    return false;
  };
  const handleCreate = async () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    const resumeId = editingResume._id;
    // Exclude (or include) items in sidebar to get the right priority
    let priority = getCategories().filter((x) => x.priority <= 1000).length;
    if (editingCategory.sidebar)
      priority = 1000 + getCategories().length - priority;
    await fauna({
      type: "CREATE_CATEGORY",
      resumeId,
      data: {
        name,
        priority: priority + 1,
      },
    }).then(
      async (data) => {
        storeCategory(data.createCategory, { add: true });
        resetPopups();
        forceRender();
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("createCategory err:", err);
      }
    );
  };
  const handleUpdate = async () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    const categoryId = editingCategory._id;
    await fauna({
      type: "UDPATE_CATEGORY",
      id: categoryId,
      data: {
        name,
      },
    }).then(
      async (data) => {
        storeCategory(data.updateCategory, {});
        resetPopups();
        forceRender();
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
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
        await fauna({ type: "DELETE_CATEGORY", id: editingCategory._id }).then(
          async (data) => {
            storeCategory(data.deleteCategory, { del: true });
            resetPopups();
            // Propagate priority updates
            for (var category of getCategories()) {
              if (category.priority > data.deleteCategory.priority) {
                const newPriority = category.priority - 1;
                await fauna({
                  type: "UDPATE_CATEGORY",
                  id: category._id,
                  data: { priority: newPriority },
                });
                storeCategory({ ...category, priority: newPriority }, {});
              }
            }
          },
          (err) => {
            toast.error(`⚠️ ${err}`);
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
