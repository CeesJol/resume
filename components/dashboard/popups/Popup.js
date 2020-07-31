import React, { useState, useEffect, useContext } from "react";
import {
  deleteItem,
  updateItem,
  createItem,
  readUser,
} from "../../../pages/api/fauna";
import { UserContext } from "../../../contexts/userContext";
import { DashboardContext } from "../../../contexts/dashboardContext";
import Button from "../../general/Button";
import Monthpicker from "../../general/Monthpicker";
import Yearpicker from "../../general/Yearpicker";

export default () => {
  const { getUser, storeUser } = useContext(UserContext);
  const { nav, editingItem, setEditingItem, editingResume, setWarning } = useContext(
    DashboardContext
  );
  const [filled, setFilled] = useState(false);
  const [title, setTitle] = useState("");
  const [isGoing, setIsGoing] = useState(true);
  const [month1, setMonth1] = useState("");
  const [year1, setYear1] = useState("");
  const [month2, setMonth2] = useState("");
  const [year2, setYear2] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleChangeLocation = (event) => {
    setLocation(event.target.value);
  };
  const handleChangeIsGoing = (event) => {
    setIsGoing(!isGoing);
  };
  const handleChangeMonth1 = (event) => {
    setMonth1(event.target.value);
  };
  const handleChangeYear1 = (event) => {
    setYear1(event.target.value);
  };
  const handleChangeMonth2 = (event) => {
    setMonth2(event.target.value);
  };
  const handleChangeYear2 = (event) => {
    setYear2(event.target.value);
  };
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
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
    await deleteItem(editingItem._id).then(
      async () => {
        await readUser(getUser().id).then(
          (res) => {
            storeUser(res.findUserByID);
            setEditingItem(-1);
          },
          (err) => {
            console.log("readUser res ERR", err);
          }
        );
      },
      (err) => {
        console.log("err", err);
      }
    );
  };
  const handleUpdate = async () => {
    const validate = validateInput();
    if (validate) {
      setStatus(validate);
      return;
    }

    const from = month1 + "/" + year1;
    const to = isGoing ? "Present" : month2 + "/" + year2;
    const categoryId = editingItem.category._id;
    await updateItem(categoryId, {
      id: editingItem._id,
      title,
      location,
      from,
      to,
      description,
    }).then(
      async () => {
        await readUser(getUser().id).then(
          (res) => {
            storeUser(res.findUserByID);
            setEditingItem(-1);
          },
          (err) => {
            console.log("readUser res ERR", err);
          }
        );
      },
      (err) => {
        console.log("updateItem err:", err);
      }
    );
  };
  const handleCreate = async () => {
    const validate = validateInput();
    if (validate) {
      setStatus(validate);
      return;
    }

    const from = month1 + "/" + year1;
    const to = isGoing ? "Present" : month2 + "/" + year2;
    const categoryId = editingItem.category._id;
    await createItem(categoryId, {
      id: editingItem._id,
      title,
      location,
      from,
      to,
      description,
    }).then(
      async () => {
        await readUser(getUser().id).then(
          (res) => {
            storeUser(res.findUserByID);
            setEditingItem(-1);
          },
          (err) => {
            console.log("readUser res ERR", err);
          }
        );
      },
      (err) => {
        console.log("createItem err:", err);
      }
    );
	};
	const handleCancel = () => {
		setWarning({
			text: "Are you sure you want to cancel editing? All unsaved changes will be lost."
		})
	}
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
      <div className="popup">
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

            {status && <p>{status}</p>}

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
