import React, { useState, useEffect, useContext } from "react";
import {
	deleteItem,
	updateItem,
  createCategoryWithItem,
  readUser,
} from "../../pages/api/fauna";
import { UserContext } from "../../contexts/userContext";
import { DashboardContext } from "../../contexts/dashboardContext";
import NewItem from "./NewItem";
import Button from "../general/Button";
import Monthpicker from "../general/Monthpicker";
import Yearpicker from "../general/Yearpicker";

export default () => {
	const { getUser } = useContext(UserContext);
	const { nav, editingItem, setEditingItem, editingResume } = useContext(DashboardContext);
  const [title, setTitle] = useState(editingItem.title);
  // const [type, setType] = useState(editingItem.type);
  const [isGoing, setIsGoing] = useState(true);
  const [month1, setMonth1] = useState(editingItem.from.substring(0, 2));
  const [year1, setYear1] = useState(editingItem.from.substring(3));
  const [month2, setMonth2] = useState(editingItem.to.substring(0, 2));
  const [year2, setYear2] = useState(editingItem.to.substring(3));
  const [location, setLocation] = useState(editingItem.location);
  const [description, setDescription] = useState(editingItem.description);
  const [status, setStatus] = useState("");
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  // const handleChangeType = (event) => {
  //   setType(event.target.value);
  // };
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
    // if (!type) return "Please provide a type";
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
      () => {
        setEditingItem(-1);
      },
      (err) => {
        console.log("err", err);
      }
    );
  };
  const handleUpdate = () => {
    const validate = validateInput();
    if (validate) {
      setStatus(validate);
      return;
    }

    const from = month1 + "/" + year1;
    const to = isGoing ? "Present" : month2 + "/" + year2;
    const categoryId = editingItem.category._id;
    console.log(categoryId);
    updateItem(categoryId, {
			id: editingItem._id,
      title,
      location,
      from,
      to,
      description,
    }).then(
      () => {
        // resetForm();
        // readUser();
      },
      (err) => {
        console.log("updateItem err:", err);
      }
    );
  };
  return (
    <div className="popup-container">
      <div className="popup">
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

          {/* <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            value={type}
            onChange={handleChangeType}
          >
            <option value="">Type</option>
            <option value="Work experience">Work experience</option>
            <option value="Education">Education</option>
            <option value="Volunteer work">Volunteer work</option>
          </select> */}

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

          <Button text="Save" fn={handleUpdate} />
					<Button text="Delete" color="red" fn={handleDelete} />
        </div>
      </form>
			</div>
    </div>
  );
};
