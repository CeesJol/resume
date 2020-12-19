import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toast } from "react-toastify";
import { ALL_CATEGORIES, getCategoryType } from "../../../lib/constants";
import Categorypicker from "../pickers/Categorypicker";
import Typepicker from "../pickers/Typepicker";
import randomId from "../../../lib/randomId";
import ReactModal from "react-modal";
ReactModal.setAppElement("#__next");

const CategoryPopup = () => {
  const {
    setWarning,
    createCategory,
    deleteCategory,
    updateCategory,
    userMadeChanges,
    setUserMadeChanges,
    resetPopups,
    editingCategory,
  } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [type, setType] = useState("");
  const [showValue, setShowValue] = useState(true); // Should value be shown for title/value types?
  const getRealTitle = () => {
    return title === "Other" ? customTitle : title;
  };
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
    setType(getCategoryType(event.target.value));
  };
  const handleChangeCustomTitle = (event) => {
    setCustomTitle(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
  };
  const handleChangeShowValue = () => {
    setShowValue(!showValue);
  };
  const validateInput = () => {
    if (!title) return "Please provide a title";
    if (title === "Other" && !customTitle)
      return "Please provide a custom category title";
    return false;
  };
  const getType = () => {
    if (type === "Title and value" && !showValue) {
      return "Title without value";
    } else if (type === "Title without value" && showValue) {
      return "Title and value";
    }

    return type;
  };
  const handleCreate = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    const tempId = randomId();

    let myData = {
      ...editingCategory,
      title: getRealTitle(),
      type: getType(),
      sidebar: editingCategory.sidebar,
      id: tempId,
      items: [],
    };

    createCategory(myData);
  };
  const handleUpdate = () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    let myData = {
      ...editingCategory,
      id: editingCategory.id,
      title: getRealTitle(),
      type: getType(),
      sidebar: editingCategory.sidebar,
    };

    updateCategory(myData);
  };
  const handleDelete = (event) => {
    if (event) event.preventDefault();
    setWarning({
      text:
        "Are you sure you want to delete this category? All the items in it will be lost.",
      fn: () => {
        deleteCategory(editingCategory);
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
  const isDefaultCategory = (title) => {
    return !!ALL_CATEGORIES.find(
      (cat) => cat.title.toLowerCase() === title.toLowerCase()
    );
  };
  useEffect(() => {
    const title = editingCategory.title;
    if (!title) {
      // The category is being created
      setTitle(ALL_CATEGORIES[0].title);
      setType(ALL_CATEGORIES[0].type);
    } else {
      // If category already exists (it's being updated)
      const ty = editingCategory.type;
      setType(ty);

      if (isDefaultCategory(title)) {
        // If the category is a default category
        setTitle(title);
      } else {
        // The category is a custom category
        setTitle("Other");
        setCustomTitle(title);

        if (ty === "Title and value" || ty === "Title without value") {
          setShowValue(ty === "Title and value");
          setType("Title and value");
        }
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
          {editingCategory.title ? "Edit category" : "Create category"}
        </h4>
        <i
          onClick={handleCancel}
          className={`fa fa-close popup__header--close`}
        ></i>
      </div>
      <form>
        <div>
          <label>Category title</label>
          <Categorypicker val={title} fn={handleChangeTitle} />

          {title === "Other" && (
            <>
              <label>Custom type</label>
              <Typepicker val={type} fn={handleChangeType} />

              <label>Custom title</label>
              <input
                type="text"
                id="customTitle"
                name="customTitle"
                value={customTitle}
                onChange={handleChangeCustomTitle}
              />
            </>
          )}

          {(type === "Title and value" || type === "Title without value") && (
            <>
              <label htmlFor="isGoing">
                <input
                  name="isGoing"
                  id="isGoing"
                  type="checkbox"
                  checked={showValue}
                  onChange={handleChangeShowValue}
                />
                Show value from 1-5
              </label>
            </>
          )}

          {editingCategory.title ? (
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

export default CategoryPopup;
