import React, { useState, useEffect, useContext } from "react";
import Button from "../general/Button";
import { updateItem, deleteItem } from "../../pages/api/fauna";
import { DashboardContext } from "../../contexts/dashboardContext";

export default function Edit(props) {
	const [title, setTitle] = useState("");
	const { editingItem, handleMutation } = useContext(DashboardContext);
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleSave = async (event) => {
    if (event) event.preventDefault();
    await updateItem(editingItem._id, { title }).then(
      () => {
        // Communicate refresh to Dashboard (parent)
        handleMutation();
      },
      (err) => {
        console.log("err", err);
      }
    );
  };
  const handleDelete = async (event) => {
    if (event) event.preventDefault();
    console.log('id', editingItem._id)
    await deleteItem(editingItem._id).then(
      () => {
        // Communicate refresh to Dashboard (parent)
        handleMutation();
      },
      (err) => {
        console.log("err", err);
      }
    );
  };
  useEffect(() => {
    setTitle(editingItem.title);
  }, []);
  return (
    <>
      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Edit a item</h4>
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

          <Button text="Save" fn={handleSave} />
          <Button text="Delete" fn={handleDelete} color="red" />
        </form>
      </div>
    </>
  );
}
