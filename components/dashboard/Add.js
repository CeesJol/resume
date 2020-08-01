import React, { useState, useContext } from "react";
import Button from "../general/Button";
import {
  createItem,
  createCategoryWithItem,
  readUser,
} from "../../pages/api/fauna";
import { UserContext } from "../../contexts/userContext";
import Monthpicker from "../general/Monthpicker";
import Yearpicker from "../general/Yearpicker";

export default function Add(props) {
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
  const { getUser } = useContext(UserContext);
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
  const resetForm = () => {
    setTitle("");
    setType("");
    setLocation("");
    setMonth1("");
    setYear1("");
    setMonth2("");
    setYear2("");
    setDescription("");
    setStatus("");
	};
	const validateInput = () => {
		if (!title) return "Please provide a title"
		if (!type) return "Please provide a type"
		if (!location) return "Please provide a location"
		if (!month1) return "Please provide a starting date month"
		if (!year1) return "Please provide a starting date year"
		if (!isGoing && !month2) return "Please provide an ending date month"
		if (!isGoing && !year2) return "Please provide an ending date year"
		if (!description) return "Please provide a description"
		return false
	}
  const handleCreate = () => {
		const validate = validateInput();
		if (validate) {
			setStatus(validate);
			return;
		}
		
    const from = month1 + "/" + year1;
    const to = isGoing ? "Present" : month2 + "/" + year2;
    const category = getUser().resumes.data[0].categories.data.find(
      (x) => x.name == type
    );
    if (!category) {
			// If the category doesn't exist yet in the DB, create it 
			// (along with the item)
      const resumeId = getUser().resumes.data[0]._id;
      const categoryName = type;
      createCategoryWithItem(resumeId, categoryName, {
        title,
        location,
        from,
        to,
        description,
      }).then(
        () => {
          resetForm();
          // readUser();
        },
        (err) => {
          console.log("createCategoryWithItem err:", err);
        }
      );
      return;
    }
    const categoryId = category._id;
    console.log(categoryId);
    createItem(categoryId, {
      title,
      location,
      from,
      to,
      description,
    }).then(
      () => {
        resetForm();
        // readUser();
      },
      (err) => {
        console.log("createItem err:", err);
      }
    );
  };
  return (
    <div className="dashboard__item">
      <h4 className="dashboard__item--title">Add an item</h4>
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

          <Button text="Add" fn={handleCreate} />
        </div>
      </form>
    </div>
  );
}
