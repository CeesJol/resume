import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import { toastError } from "../../../lib/error";
import { fauna } from "../../../lib/api";

const Options = () => {
  const {
    updateResume,
    deleteResume,
    setWarning,
    editingResume,
    setPreview,
  } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleUpdate = async () => {
    if (!title) return "Please provide a resume title";

    const myData = {
      _id: editingResume._id,
      title,
    };

    await updateResume(myData);
  };
  const handleDelete = async (event) => {
    if (event) event.preventDefault();
    setWarning({
      text:
        "Are you sure you want to delete this resume? All the data of the resume will be lost.",
      fn: async () => {
        await fauna({ type: "DELETE_RESUME", id: editingResume._id }).then(
          async () => {
            deleteResume(editingResume);
            setPreview(true);
          },
          (err) => {
            toastError(err);
            console.error("deleteResume err:", err);
          }
        );
      },
    });
  };
  useEffect(() => {
    if (editingResume) {
      setTitle(editingResume.title);
    }
  }, []);
  return (
    <>
      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Rename</h4>
        <label>Resume Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleChangeTitle}
        />

        <Button text="Update" altText="Updating..." fn={handleUpdate} />
      </div>
      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Delete</h4>
        <p>Deleting a resume cannot be undone.</p>
        <Button fn={handleDelete} text="Delete" color="red" />
      </div>
    </>
  );
};

export default Options;
