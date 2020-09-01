import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";
import { ALL_CATEGORIES } from "../../../lib/constants";
import Categorypicker from "../../general/Categorypicker";
import Typepicker from "../../general/Typepicker";
import randomId from "../../../lib/randomId";

const CategoryPopup = () => {
  const {
    editingResume,
    setWarning,
    storeCategory,
    userMadeChanges,
    setUserMadeChanges,
    resetPopups,
    editingCategory,
    getCategories,
    storeStatus,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [name, setName] = useState("");
  const [customName, setCustomName] = useState("");
  const [type, setType] = useState("");
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeCustomName = (event) => {
    setCustomName(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
  };
  const validateInput = () => {
    if (!name) return "Please provide a name";
    if (name === "Other" && !customName)
      return "Please provide a custom category name";
    return false;
  };
  const handleCreate = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    const tempId = randomId();
    const priority =
      getCategories().filter((cat) => cat.sidebar === editingCategory.sidebar)
        .length + 1;

    let myData = {
      ...editingCategory,
      name: name === "Other" ? customName : name,
      type,
      sidebar: editingCategory.sidebar,
      priority,
      _id: tempId,
      items: {
        data: [],
      },
    };

    storeCategory(myData, { add: true });

    fauna({
      type: "CREATE_CATEGORY",
      resumeId: editingResume._id,
      data: myData,
    }).then(
      (data) => {
        storeCategory({ _id: tempId }, { newId: data.createCategory._id });
        storeStatus("Saved.");
      },
      (err) => storeStatus("Error: some error", err)
    );
  };
  const handleUpdate = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    let myData = {
      _id: editingCategory._id,
      name: name === "Other" ? customName : name,
      type,
      sidebar: editingCategory.sidebar,
    };

    storeCategory(myData, {});

    fauna({
      type: "UPDATE_CATEGORY",
      id: editingCategory._id,
      data: myData,
    }).then(
      () => storeStatus("Saved."),
      (err) => storeStatus("Error: failed to save", err)
    );
  };
  const handleDelete = (event) => {
    if (event) event.preventDefault();
    setWarning({
      text:
        "Are you sure you want to delete this category? All the items in it will be lost.",
      fn: () => {
        storeCategory(editingCategory, { del: true });
        // Propagate priority updates
        for (var category of getCategories()) {
          if (
            category.priority > editingCategory.priority &&
            category.sidebar === editingCategory.sidebar
          ) {
            const newPriority = category.priority - 1;
            storeCategory({ ...category, priority: newPriority }, {});
          }
        }

        fauna({ type: "DELETE_CATEGORY", id: editingCategory._id }).then(
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
    if (!filled) {
      setFilled(true);
      const name = editingCategory.name;
      if (!name) {
        // The category is being created
        setName(ALL_CATEGORIES[0].name);
        setType(ALL_CATEGORIES[0].type);
      } else {
        // If category already exists (it's being updated)
        setType(editingCategory.type);
        if (
          ALL_CATEGORIES.find(
            (cat) => cat.name.toLowerCase() === name.toLowerCase()
          )
        ) {
          // If the category is a default category
          setName(name);
        } else {
          // The category is a custom category
          setName("Other");
          setCustomName(name);
        }
      }
    }
  });
  return (
    <div className="popup-container" onClick={handleCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4 className="popup--title">
          {editingCategory.name ? "Edit category" : "Create category"}
        </h4>
        <form>
          <div>
            <label>Category name</label>
            <Categorypicker val={name} fn={handleChangeName} />

            {name === "Other" && (
              <>
                <label>Custom type</label>
                <Typepicker val={type} fn={handleChangeType} />

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
