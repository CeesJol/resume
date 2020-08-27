import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { fauna } from "../../lib/api";
import { toast } from "react-toastify";

const Options = () => {
  const {
    storeResume,
    setWarning,
    editingResume,
    resetPopups,
    getResumes,
    setPreview,
    storeStatus,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [title, setTitle] = useState("");
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleUpdate = () => {
    if (!title) return "Please provide a resume title";

    const myData = {
      _id: editingResume._id,
      title,
    };

    storeResume(myData, {});

    fauna({
      type: "UPDATE_RESUME",
      id: myData._id,
      data: myData,
    }).then(
      () => storeStatus("Saved."),
      (err) => storeStatus("Failed to save", err)
    );
  };
  const handleDelete = async (event) => {
    if (event) event.preventDefault();
    setWarning({
      text:
        "Are you sure you want to delete this resume? All the data of the resume will be lost.",
      fn: async () => {
        await fauna({ type: "DELETE_RESUME", id: editingResume._id }).then(
          async (data) => {
            storeResume(editingResume, { del: true });
            resetPopups();
            setPreview(true);
            storeStatus("Saved.");
            // Propagate priority updates
            for (var resume of getResumes()) {
              if (resume.priority > editingResume.priority) {
                const newPriority = resume.priority - 1;
                storeResume({ ...resume, priority: newPriority }, {});
              }
            }
          },
          (err) => {
            toast.error(`⚠️ ${err}`);
            console.error("deleteCategory err:", err);
          }
        );
      },
    });
  };
  useEffect(() => {
    if (!filled && editingResume) {
      setFilled(true);
      setTitle(editingResume.title);
    }
  });
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
