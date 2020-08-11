import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { deleteResume } from "../../pages/api/fauna";

const Options = () => {
  const {
    getUser,
    setEditingResume,
    setCreatingResume,
    setChangingResume,
    setWarning,
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
            // for (var category of getCategories()) {
            //   if (category.priority > data.deleteResume.priority) {
            //     const newPriority = category.priority - 1;
            //     updateResume(category._id, { priority: newPriority });
            //     storeResume({ ...category, priority: newPriority }, {});
            //   }
            // }
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
				<p>asdf</p>
      </div>
    </>
  );
};

export default Options;
