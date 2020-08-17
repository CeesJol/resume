import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Template from "../Template";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";

const ResumePopup = () => {
  const {
    getUser,
    setWarning,
    userMadeChanges,
    setUserMadeChanges,
    storeResume,
    resetPopups,
    selectedTemplateId,
    templates,
    setTemplates,
    setEditingResume,
    setChangingResume,
    getResumes,
    getLayout,
  } = useContext(UserContext);
  const [title, setTitle] = useState("");
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

    const user = getUser();
    await fauna({
      type: "CREATE_RESUME",
      userId: user.id,
      templateId: selectedTemplateId,
      data: {
        title,
        layout: getLayout(),
        jobTitle: user.jobTitle ? user.jobTitle : "",
        bio: user.bio ? user.bio : "",
        priority: getResumes().length + 1,
      },
    }).then(
      (data) => {
        storeResume(data.createResume, { add: true });
        setEditingResume(data.createResume);
        setChangingResume(true);
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
    if (templates.length == 0) {
      fauna({ type: "GET_TEMPLATES" }).then((data) => {
        setTemplates(data.templates.data);
      });
    }
  }, []);
  return (
    <div className="popup-container" onClick={handleCancel}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4>Create resume</h4>
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
