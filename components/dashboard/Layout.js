import React, { useContext, useState, useEffect } from "react";
import { updateTemplate } from "../../pages/api/fauna";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";

const Layout = () => {
  const { getUser, editingResume, storeTemplate, resetPopups } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [name, setName] = useState("");
  const [style, setStyle] = useState("");
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeStyle = (event) => {
    setStyle(event.target.value);
  };
  useEffect(() => {
    if (!filled && editingResume !== -1) {
      setFilled(true);

      setName(editingResume.template.name);
      setStyle(editingResume.template.style);
    }
  });
  const handleUpdate = async () => {
    await updateTemplate(editingResume.template._id, {
      style
    }).then(
      (data) => {
        storeTemplate(data.updateTemplate);
        resetPopups();
      },
      (err) => {
        console.error("updateTemplate err:", err);
      }
    );
	};
  return (
    <div className="dashboard__item">
      {editingResume !== -1 ? (
        <>
          <h4>{name}</h4>
          <div>
            <form>
              <div>
                {/* <label>Job title</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={jobTitle}
              onChange={handleChangeJobTitle}
            /> */}

                <label>Style</label>
                <textarea
                  type="text"
                  id="style"
                  name="style"
                  value={style}
                  onChange={handleChangeStyle}
                />

                <Button text="Update" altText="Updating..." fn={handleUpdate} />
              </div>
            </form>
          </div>
        </>
      ) : (
        <p>Select a resume to edit the layout</p>
      )}
    </div>
  );
};

export default Layout;