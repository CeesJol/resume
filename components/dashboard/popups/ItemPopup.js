import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Monthpicker from "../pickers/Monthpicker";
import Yearpicker from "../pickers/Yearpicker";
import Valuepicker from "../pickers/Valuepicker";
import { toastError } from "../../../lib/error";
import {
  getCategoryItems,
  getCategoryIsGoingText,
} from "../../../lib/constants";
import randomId from "../../../lib/randomId";
import ReactModal from "react-modal";
import markdownActions from "../../../lib/markdownActions";
import CloseButton from "../CloseButton";
ReactModal.setAppElement("#__next");

const ItemPopup = () => {
  const textareaRef = useRef();
  const {
    editingItem,
    setWarning,
    createItem,
    deleteItem,
    updateItem,
    userMadeChanges,
    setUserMadeChanges,
    resetPopups,
    getCategory,
  } = useContext(UserContext);
  const [isGoing, setIsGoing] = useState(true); // Separated from fields, because DB doesn't take this value.
  const [fields, setFields] = useState({
    title: "",
    month1: "",
    year1: "",
    month2: "",
    year2: "",
    location: "",
    description: "",
    value: "3",
  });
  const category = getCategory(editingItem.categoryId);
  const categoryItems = getCategoryItems(category.type);
  const handleChange = (event) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
    if (!userMadeChanges) setUserMadeChanges(true);
  };
  const insertList = () => {
    let cursor = textareaRef.current.selectionStart;
    let newDescription = markdownActions.list(fields.description, cursor);
    setFields({
      ...fields,
      ["description"]: newDescription,
    });
    if (!userMadeChanges) setUserMadeChanges(true);
  };
  const insertBoldText = () => {
    let cursorStart = textareaRef.current.selectionStart;
    let cursorEnd = textareaRef.current.selectionEnd;
    let newDescription = markdownActions.bold(
      fields.description,
      cursorStart,
      cursorEnd
    );
    setFields({
      ...fields,
      ["description"]: newDescription,
    });
    if (!userMadeChanges) setUserMadeChanges(true);
  };
  const handleChangeIsGoing = () => {
    setIsGoing(!isGoing);
  };
  const validateInput = () => {
    if (!fields.title && categoryItems.includes("title"))
      return "Please provide a title";

    return false;
  };
  const handleCreate = () => {
    const validationError = validateInput();
    if (validationError) {
      toastError(validationError);
      return;
    }

    if (isGoing) {
      fields.month2 = "";
      fields.year2 = "";
    }

    // Get relevant data
    let myData = {
      ...editingItem,
      ...fields,
      categoryId: category.id,
      id: randomId(),
    };
    Object.keys(myData).forEach(
      (key) => myData[key] === "" && delete myData[key]
    );
    createItem(myData);
  };
  const handleUpdate = () => {
    const validationError = validateInput();
    if (validationError) {
      toastError(validationError);
      return;
    }

    if (isGoing) {
      fields.month2 = "";
      fields.year2 = "";
    }

    // Get relevant data
    let myData = { ...editingItem, ...fields };
    Object.keys(myData).forEach(
      (key) => myData[key] === "" && delete myData[key]
    );
    updateItem(myData);
  };
  const handleDelete = (event) => {
    if (event) event.preventDefault();
    setWarning({
      text: "Are you sure you want to delete this item?",
      fn: () => {
        deleteItem(editingItem);
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
    // Updating item
    if (editingItem.id) {
      setFields({
        ...fields,
        title: editingItem.title,
        month1: editingItem.month1 || "",
        year1: editingItem.year1 || "",
        month2: editingItem.month2 || "",
        year2: editingItem.year2 || "",
        location: editingItem.location || "",
        description: editingItem.description || "",
        value: editingItem.value || "3",
      });

      setIsGoing(!editingItem.year2);
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
          {editingItem.id ? "Edit item" : "Create item"}
        </h4>
        <CloseButton fn={handleCancel} />
      </div>
      <form>
        <div>
          {categoryItems.includes("title") && (
            <>
              <label>Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={fields.title}
                onChange={handleChange}
              />
            </>
          )}
          {categoryItems.includes("location") && (
            <>
              <label>Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={fields.location}
                onChange={handleChange}
              />
            </>
          )}
          {categoryItems.includes("year2") && (
            <>
              <label htmlFor="isGoing">
                <input
                  name="isGoing"
                  id="isGoing"
                  type="checkbox"
                  checked={isGoing}
                  onChange={handleChangeIsGoing}
                />
                {getCategoryIsGoingText(category.title)}
              </label>
            </>
          )}

          {categoryItems.includes("year1") && (
            <>
              <div>
                <label>
                  {category.type === "Title and date"
                    ? "Achieved on"
                    : "Start date"}
                </label>
                <Monthpicker
                  val={fields.month1}
                  name="month1"
                  fn={handleChange}
                />
                <Yearpicker val={fields.year1} name="year1" fn={handleChange} />
              </div>
            </>
          )}

          {categoryItems.includes("year1") && !isGoing && (
            <>
              <div>
                <label>End date</label>
                <Monthpicker
                  val={fields.month2}
                  name="month2"
                  fn={handleChange}
                />
                <Yearpicker val={fields.year2} name="year2" fn={handleChange} />
              </div>
            </>
          )}

          {categoryItems.includes("description") && (
            <>
              <label>
                Description -{" "}
                <a style={{ color: "blue" }} onClick={insertList}>
                  Insert list
                </a>{" "}
                -{" "}
                <a style={{ color: "blue" }} onClick={insertBoldText}>
                  Insert bold text
                </a>
              </label>
              <textarea
                type="text"
                id="description"
                name="description"
                value={fields.description}
                onChange={handleChange}
                ref={textareaRef}
              />
            </>
          )}
          {categoryItems.includes("value") && (
            <>
              <label>Value</label>
              <Valuepicker
                val={fields.value || "3"}
                name="value"
                fn={handleChange}
              />
            </>
          )}

          {editingItem.id ? (
            <>
              <Button text="Save" altText="Saving..." fn={handleUpdate} />
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

export default ItemPopup;
