import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Monthpicker from "../../general/Monthpicker";
import Yearpicker from "../../general/Yearpicker";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";
import { GET_CATEGORY_ITEMS } from "../../../lib/constants";

const Popup = () => {
  const {
    editingItem,
    setWarning,
    storeItem,
    userMadeChanges,
    setUserMadeChanges,
    resetPopups,
    getCategory,
    getItems,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [isGoing, setIsGoing] = useState(true); // Seperate from fields, because DB doesn't take this value.
  const [fields, setFields] = useState({
    title: "",
    month0: "",
    year0: "",
    month1: "",
    year1: "",
    month2: "",
    year2: "",
    location: "",
    description: "",
    value: "",
  });
  const category = getCategory(editingItem.category._id);
  const categoryItems = GET_CATEGORY_ITEMS(category.type);
  function handleChange(event) {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
    if (!userMadeChanges) setUserMadeChanges(true);
  }
  const handleChangeIsGoing = () => {
    setIsGoing(!isGoing);
  };
  const validateInput = () => {
    if (!fields.title) return "Please provide a title";

    return false;
  };
  const handleDelete = async (event) => {
    if (event) event.preventDefault();
    setWarning({
      text: "Are you sure you want to delete this item?",
      fn: async () => {
        await fauna({ type: "DELETE_ITEM", id: editingItem._id }).then(
          async (data) => {
            storeItem(editingItem, { del: true });
            resetPopups();
            // Propagate priority updates
            for (var item of getItems(category)) {
              if (item.priority > editingItem.priority) {
                const newPriority = item.priority - 1;
                storeItem({ ...item, priority: newPriority }, {});
              }
            }
          },
          (err) => {
            toast.error(`⚠️ ${err}`);
            console.error("deleteItem err:", err);
          }
        );
      },
    });
  };
  const handleUpdate = async () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    // Get relevant data
    let myData = fields;
    Object.keys(myData).forEach(
      (key) => !categoryItems.includes(key) && delete myData[key]
    );
    if (isGoing) {
      myData.month2 = "";
      myData.year2 = "";
    }
    console.log("fields:", myData);
    await fauna({
      type: "UPDATE_ITEM",
      id: editingItem._id,
      data: { ...myData },
    }).then(
      async (data) => {
        storeItem(data.updateItem, {});
        resetPopups();
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("updateItem err:", err);
      }
    );
  };
  const handleCreate = async () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    // Get relevant data
    let myData = fields;
    Object.keys(myData).forEach(
      (key) => !categoryItems.includes(key) && delete myData[key]
    );
    if (isGoing) {
      myData.month2 = "";
      myData.year2 = "";
    }
    console.log("fields:", myData);
    const categoryId = editingItem.category._id;
    await fauna({
      type: "CREATE_ITEM",
      categoryId,
      data: { ...fields },
    }).then(
      async (data) => {
        storeItem(data.createItem, { add: true });
        resetPopups();
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("createItem err:", err);
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
    if (editingItem.title && !filled) {
      // Updating item
      setFilled(true);

      setFields({
        title: editingItem.title,
        month1: editingItem.month1,
        year1: editingItem.year1,
        month2: editingItem.month2,
        year2: editingItem.year2,
        location: editingItem.location,
        description: editingItem.description,
        value: editingItem.value,
      });
      setIsGoing(!editingItem.year2);
    }
  });
  return (
    <div className="popup-container" onClick={handleCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4>{editingItem.title ? "Edit item" : "Create item"}</h4>
        <form>
          <div>
            <label>Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={fields.title}
              onChange={handleChange}
            />
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
                  I'm currently working here
                </label>
              </>
            )}

            {categoryItems.includes("year1") && (
              <>
                <div>
                  <label>Start date</label>
                  <Monthpicker
                    val={fields.month1}
                    name={"month1"}
                    fn={handleChange}
                  />
                  <Yearpicker
                    val={fields.year1}
                    name={"year1"}
                    fn={handleChange}
                  />
                </div>
              </>
            )}

            {categoryItems.includes("year1") && !isGoing && (
              <>
                <div>
                  <label>End date</label>
                  <Monthpicker
                    val={fields.month2}
                    name={"month2"}
                    fn={handleChange}
                  />
                  <Yearpicker
                    val={fields.year2}
                    name={"year2"}
                    fn={handleChange}
                  />
                </div>
              </>
            )}

            {categoryItems.includes("description") && (
              <>
                <label>Description</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  value={fields.description}
                  onChange={handleChange}
                />
              </>
            )}
            {categoryItems.includes("value") && (
              <>
                <label>Value</label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={fields.value}
                  onChange={handleChange}
                />
              </>
            )}

            {editingItem.title ? (
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
      </div>
    </div>
  );
};

export default Popup;
