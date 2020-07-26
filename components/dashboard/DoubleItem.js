import React, { useState, useContext } from "react";
import Button from "../general/Button";
import {
  createItem,
  createCategoryWithItem,
  readUser,
} from "../../pages/api/fauna";
import { UserContext } from "../../contexts/userContext";
import { DashboardContext } from "../../contexts/dashboardContext";
import Monthpicker from "../general/Monthpicker";
import Yearpicker from "../general/Yearpicker";

const DoubleItem = ({ item }) => {
  const [editing, setEditing] = useState(false);
  const handleClick = () => {
    if (!editing) {
      setEditing(true);
    }
  };

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
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
  const handleChangeType = (event) => {
    setType(event.target.value);
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
    if (!type) return "Please provide a type";
    if (!location) return "Please provide a location";
    if (!month1) return "Please provide a starting date month";
    if (!year1) return "Please provide a starting date year";
    if (!isGoing && !month2) return "Please provide an ending date month";
    if (!isGoing && !year2) return "Please provide an ending date year";
    if (!description) return "Please provide a description";
    return false;
	};
	
	const handleSave = () => {
		

		setEditing(false);
	}

  return (
    <a onClick={handleClick}>
      {editing ? (
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

            <label htmlFor="type">Type</label>
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
            </select>

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

            <Button text="Save" fn={handleSave} />
          </div>
        </form>
      ) : (
        <div className="item">
          <h3>{item.title}</h3>
          <i>{item.location}</i>
          <p>
            {item.from} - {item.to}
          </p>
          <p>{item.description}</p>
        </div>
      )}
    </a>
  );
};

export default DoubleItem;
