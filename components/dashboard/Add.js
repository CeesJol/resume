import React, { useState, useContext } from "react";
import Button from "../general/Button";
import { createItem } from "../../pages/api/fauna";
import { UserContext } from "../../contexts/userContext";
import { DashboardContext } from "../../contexts/dashboardContext";

export default function Add(props) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
	const { getUser } = useContext(UserContext);
	const { getItems } = useContext(DashboardContext);
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const resetForm = () => {
    setTitle("");
    setStatus("");
  };
  const handleCreate = () => {
    createItem(getUser(), { title }).then(() => {
      resetForm();
      getItems();
    }, (err) => {
      console.log('createItem err:', err)
    })
  }
  return (
    <div className="dashboard__create">
      <h4 className="dashboard__create--title">Add an item</h4>
      <form>
        <label>Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleChangeTitle}
        />

        {status && <p>{status}</p>}

        <Button text="Add" fn={handleCreate} />
      </form>
    </div>
  );
}
