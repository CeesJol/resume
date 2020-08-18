import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Monthpicker from "../../general/Monthpicker";
import Yearpicker from "../../general/Yearpicker";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";

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
  const [fields, setFields] = useState({
    title: "",
    isGoing: true,
    month1: "",
    year1: "",
    month2: "",
    year2: "",
    location: "",
    description: "",
  });
  function handleChange(event) {
    const value =
      event.target.type === "checkbox"
        ? !fields[event.target.name]
        : event.target.value;
    setFields({
      ...fields,
      [event.target.name]: value,
    });
    if (!userMadeChanges) setUserMadeChanges(true);
  }
  const validateInput = () => {
    if (!fields.title) return "Please provide a title";
    // if (!fields.location) return "Please provide a location";
    // if (!fields.month1) return "Please provide a starting date month";
    // if (!fields.year1) return "Please provide a starting date year";
    // if (!fields.isGoing && !fields.month2)
    //   return "Please provide an ending date month";
    // if (!fields.isGoing && !fields.year2)
    //   return "Please provide an ending date year";
    // if (!fields.description) return "Please provide a description";

    if (!!fields.month1 ^ !!fields.year1)
      return "Please provide both a starting month and year";
    if (!isGoing && !!fields.month2 ^ !!fields.year2)
      return "Please provide both an ending month and year";

    return false;
  };
  const getFromAndTo = () => {
    let from;
    if (fields.month1 && fields.year1) {
      from = fields.month1 + "/" + fields.year1;
      // } else if (fields.year1) {
      //   from = fields.year1;
    } else {
      from = "";
    }

    let to;
    if (fields.isGoing) {
      to = "Present";
    } else if (fields.month2 && fields.year2) {
      to = fields.month2 + "/" + fields.year2;
      // } else if (fields.year2) {
      //   to = fields.year2;
    } else {
      to = "";
    }

    return { from, to };
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
            const category = getCategory(editingItem.category._id);
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

    const { from, to } = getFromAndTo();
    await fauna({
      type: "UPDATE_ITEM",
      id: editingItem._id,
      data: {
        title: fields.title,
        location: fields.location,
        from,
        to,
        description: fields.description,
      },
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

    const { from, to } = getFromAndTo();
    const categoryId = editingItem.category._id;
    await fauna({
      type: "CREATE_ITEM",
      categoryId,
      data: {
        id: editingItem._id,
        title: fields.title,
        location: fields.location,
        from,
        to,
        description: fields.description,
        priority: getItems(getCategory(categoryId)).length + 1,
      },
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
      setFilled(true);

      setFields({
        title: editingItem.title,
        isGoing: editingItem.to == "Present",
        month1: editingItem.from.substring(0, 2),
        year1: editingItem.from.substring(3),
        month2:
          editingItem.to != "Present" ? editingItem.to.substring(0, 2) : "",
        year2: editingItem.to != "Present" ? editingItem.to.substring(3) : "",
        location: editingItem.location,
        description: editingItem.description,
      });
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

            <label>Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={fields.location}
              onChange={handleChange}
            />

            <label htmlFor="isGoing">
              <input
                name="isGoing"
                id="isGoing"
                type="checkbox"
                checked={fields.isGoing}
                onChange={handleChange}
              />
              I'm currently working here
            </label>

            <div>
              <label>Start date</label>
              <Monthpicker
                val={fields.month1}
                name={"month1"}
                fn={handleChange}
              />
              <Yearpicker val={fields.year1} name={"year1"} fn={handleChange} />
            </div>

            {!fields.isGoing && (
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
            )}

            <label>Description</label>
            <textarea
              type="text"
              id="description"
              name="description"
              value={fields.description}
              onChange={handleChange}
            />

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
