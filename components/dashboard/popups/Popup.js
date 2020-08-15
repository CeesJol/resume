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
  const [title, setTitle] = useState("");
  const [isGoing, setIsGoing] = useState(true);
  const [month1, setMonth1] = useState("");
  const [year1, setYear1] = useState("");
  const [month2, setMonth2] = useState("");
  const [year2, setYear2] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeLocation = (event) => {
    setLocation(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeIsGoing = (event) => {
    setIsGoing(!isGoing);
    setUserMadeChanges(true);
  };
  const handleChangeMonth1 = (event) => {
    setMonth1(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeYear1 = (event) => {
    setYear1(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeMonth2 = (event) => {
    setMonth2(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeYear2 = (event) => {
    setYear2(event.target.value);
    setUserMadeChanges(true);
  };
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
    setUserMadeChanges(true);
  };
  const validateInput = () => {
    if (!title) return "Please provide a title";
    if (!location) return "Please provide a location";
    if (!month1) return "Please provide a starting date month";
    if (!year1) return "Please provide a starting date year";
    if (!isGoing && !month2) return "Please provide an ending date month";
    if (!isGoing && !year2) return "Please provide an ending date year";
    if (!description) return "Please provide a description";
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

    const from = month1 + "/" + year1;
    const to = isGoing ? "Present" : month2 + "/" + year2;
    const categoryId = editingItem.category._id;
    await fauna({
      type: "UPDATE_ITEM",
      id: editingItem._id,
      data: {
        title,
        location,
        from,
        to,
        description,
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

    const from = month1 + "/" + year1;
    const to = isGoing ? "Present" : month2 + "/" + year2;
    const categoryId = editingItem.category._id;
    await fauna({
      type: "CREATE_ITEM",
      categoryId,
      data: {
        id: editingItem._id,
        title,
        location,
        from,
        to,
        description,
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

      setTitle(editingItem.title);
      setIsGoing(editingItem.to == "Present");
      setMonth1(editingItem.from.substring(0, 2));
      setYear1(editingItem.from.substring(3));
      if (editingItem.to != "Present") {
        setMonth2(editingItem.to.substring(0, 2));
        setYear2(editingItem.to.substring(3));
      }
      setLocation(editingItem.location);
      setDescription(editingItem.description);
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
              value={title}
              onChange={handleChangeTitle}
            />

            <label>Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={handleChangeLocation}
            />

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

            <div>
              <label>Start date</label>
              <Monthpicker val={month1} fn={handleChangeMonth1} />
              <Yearpicker val={year1} fn={handleChangeYear1} />
            </div>

            {!isGoing && (
              <div>
                <label>End date</label>
                <Monthpicker val={month2} fn={handleChangeMonth2} />
                <Yearpicker val={year2} fn={handleChangeYear2} />
              </div>
            )}

            <label>Description</label>
            <textarea
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={handleChangeDescription}
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
