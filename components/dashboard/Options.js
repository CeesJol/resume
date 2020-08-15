import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { fauna } from "../../lib/api";

const Options = () => {
  const {
    storeResume,
    setWarning,
    editingResume,
    resetPopups,
    getUser,
    getResumes,
  } = useContext(UserContext);
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
  return (
    <>
      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Options</h4>
        <Button fn={handleDelete} text="Delete" color="red" />
      </div>
    </>
  );
};

export default Options;
