import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";
import { SIDEBAR_INCREMENT, defaultCategories } from "../../../lib/constants";
import Categorypicker from "../../general/Categorypicker";

const CategoryPopup = () => {
  const {
    editingResume,
    setWarning,
    storeCategory,
    userMadeChanges,
    setUserMadeChanges,
    resetPopups,
    forceRender,
    editingCategory,
    getCategories,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [name, setName] = useState("");
  const [customName, setCustomName] = useState("");
  const handleChangeName = (event) => {
    console.log(event.target.value);
    setName(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeCustomName = (event) => {
    setCustomName(event.target.value);
    setUserMadeChanges(true);
  };
  const validateInput = () => {
    if (!name) return "Please provide a name";
    if (name === "Other" && !customName)
      return "Please provide a custom category name";
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
    let priority = getCategories().filter(
      (x) => x.priority <= SIDEBAR_INCREMENT
    ).length;
    if (editingCategory.sidebar)
      priority = SIDEBAR_INCREMENT + getCategories().length - priority;
    await fauna({
      type: "CREATE_CATEGORY",
      resumeId,
      data: {
        name: name !== "Other" ? name : customName,
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
      type: "UPDATE_CATEGORY",
      id: categoryId,
      data: {
        name: name !== "Other" ? name : customName,
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
            storeCategory(editingCategory, { del: true });
            resetPopups();
            // Propagate priority updates
            for (var category of getCategories()) {
              if (
                category.priority > editingCategory.priority &&
                Math.abs(category.priority - editingCategory.priority) <
                  SIDEBAR_INCREMENT / 2
              ) {
                const newPriority = category.priority - 1;
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
		if (!filled) {
			setFilled(true);
			const name = editingCategory.name;
			if (name) {
				if (defaultCategories.includes(name)) {
					setName(name);
				} else {
					setName("Other");
					setCustomName(name);
				}
			} else {
				setName(defaultCategories[0]);
			}
		}
  });
  return (
    <div className="popup-container" onClick={handleCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4>{editingCategory.name ? "Edit category" : "Create category"}</h4>
        <form>
          <div>
            <label>Category name</label>
            <Categorypicker val={name} fn={handleChangeName} />

            {name === "Other" && (
              <>
                <label>Custom name</label>
                <input
                  type="text"
                  id="customName"
                  name="customName"
                  value={customName}
                  onChange={handleChangeCustomName}
                />
              </>
            )}

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
