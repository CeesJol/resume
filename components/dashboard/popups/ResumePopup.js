import React, { useState, useEffect, useContext } from "react";
import { createResume, getTemplates } from "../../../pages/api/fauna";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Template from "../Template";
import { toast } from "react-toastify";

const ResumePopup = () => {
  const {
    getUser,
    storeUser,
    editingResume,
    setEditingResume,
    warning,
    setWarning,
    setChangingInfo,
    userMadeChanges,
    setUserMadeChanges,
    storeResume,
    resetPopups,
    selectedTemplateId,
  } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [templates, setTemplates] = useState(false);
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
    setUserMadeChanges(true);
  };
  const validateInput = () => {
    if (!title) return "Please provide a resume title";
    if (!selectedTemplateId) return "Please choose a template";
    return false;
  };
  const handleCreate = async () => {
    const validationError = validateInput();
    if (validationError) {
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    await createResume(getUser().id, selectedTemplateId, {
      title,
    }).then(
      (data) => {
        storeResume(data.createResume, { add: true });
        resetPopups();
      },
      (err) => {
				toast.error(`⚠️ ${err}`);
        console.log("createResume err:", err);
      }
    );
  };
  const handleCancel = () => {
    if (userMadeChanges) {
      setWarning({
        text: "Are you sure you want to cancel creating this resume?",
      });
    } else {
      resetPopups();
    }
  };
  useEffect(() => {
    // load templates
    getTemplates().then((data) => {
      setTemplates(data.templates.data);
    });
  }, []);
  return (
    <div className="popup-container" onClick={handleCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4>Update info</h4>
        <form>
          <div>
            <label>Job title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChangeTitle}
            />

            <label>Template</label>
            {templates ? (
              templates.map((template) => (
                <Template template={template} key={template._id} />
              ))
            ) : (
              <p>Loading templates...</p>
            )}
            <br />
            <Button text="Create" altText="Creating..." fn={handleCreate} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumePopup;
