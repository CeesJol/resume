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
  const [fields, setFields] = useState({});
  const category = getCategory(editingItem.categoryId);
  const categoryItems = getCategoryItems(category);
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
    const newFields = {};
    for (let item of categoryItems) {
      if (["id", "categoryId", "items"].includes(item)) {
        continue;
      }
      newFields[item] = editingItem[item] || "";
    }
    setFields(newFields);
    setIsGoing(!editingItem.year2);
  }, []);
  const drawField = (key, value) => {
    const getDateText = (lastChar) => {
      if (!categoryItems.includes("month2")) return "Date";
      if (lastChar === "1") return "Start Date";
      return "End Date";
    };
    switch (key) {
      case "month1":
      case "month2":
        const lastChar = key.substr(key.length - 1);
        return (
          <>
            {/* Draw checkbox above month1, year1 */}
            {lastChar === "1" && categoryItems.includes("month2") && (
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
            {/* Don't draw month2, year2 if job is ongoing */}
            {!(isGoing && lastChar === "2") && (
              <div>
                <label>{getDateText(lastChar)}</label>
                <Monthpicker
                  val={fields[`month${lastChar}`]}
                  name={`month${lastChar}`}
                  fn={handleChange}
                />
                <Yearpicker
                  val={fields[`year${lastChar}`]}
                  name={`year${lastChar}`}
                  fn={handleChange}
                />
              </div>
            )}
          </>
        );
      case "year1":
      case "year2":
        return null;
      case "description":
        return (
          <>
            <label>
              Description
              <br />
              Use "- " to insert a list, or click
              <a style={{ color: "blue" }} onClick={insertList}>
                {" "}
                here to generate one
              </a>
              .
              <br />
              Use **two stars** to create <b>bold text</b>
              {/* <a style={{ color: "blue" }} onClick={insertBoldText}>
                Insert bold text
              </a> */}
            </label>
            <textarea
              type="text"
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              ref={textareaRef}
            />
          </>
        );
      case "value":
        return (
          <>
            <label>Value</label>
            <Valuepicker
              val={fields.value || "3"}
              name="value"
              fn={handleChange}
            />
          </>
        );
      default:
        return (
          <>
            <label className="upper">{key}</label>
            <input
              type="text"
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
            />
          </>
        );
    }
  };
  return (
    <ReactModal
      className="popup"
      isOpen={true}
      overlayClassName="popup-container"
      onRequestClose={handleCancel}
    >
      <div className="popup__header">
        <h4 className="popup__header--title">
          {editingItem.id ? "Edit" : "Create"} item
        </h4>
        <CloseButton fn={handleCancel} />
      </div>
      <form>
        <div>
          {Object.keys(fields).map((key) => (
            <div key={`field-${key}`}>{drawField(key, fields[key])}</div>
          ))}

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
