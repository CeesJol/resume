import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { deleteResume, updateResume } from "../../pages/api/fauna";

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
        await deleteResume(editingResume._id).then(
          async (data) => {
            storeResume(data.deleteResume, { del: true });
            resetPopups();
            // Propagate priority updates
            for (var resume of getResumes()) {
              if (resume.priority > data.deleteResume.priority) {
                const newPriority = resume.priority - 1;
                updateResume(resume._id, { priority: newPriority });
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
