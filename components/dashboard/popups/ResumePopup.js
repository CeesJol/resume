import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Template from "../Template";
import { toast } from "react-toastify";
import { fauna } from "../../../lib/api";
import { TEMPLATES, getTemplate } from "../../../templates/templates";
import {
  DEFAULT_CATEGORIES,
  RESUME_SKELETON,
  convertToTemplate,
} from "../../../lib/constants";
import ReactModal from "react-modal";
ReactModal.setAppElement("#__next");

const ResumePopup = () => {
  const {
    user,
    setWarning,
    userMadeChanges,
    setUserMadeChanges,
    createResume,
    resetPopups,
    selectedTemplateId,
    templates,
    setTemplates,
    setEditingResume,
    setChangingResume,
    getResumes,
    storeStatus,
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

    // Set whether to show value depending on resume property
    const template = getTemplate(selectedTemplateId);
    const categories = convertToTemplate(DEFAULT_CATEGORIES, template);

    const styles = getTemplate(selectedTemplateId).styles;
    await fauna({
      type: "CREATE_RESUME",
      userId: user._id,
      data: {
        ...RESUME_SKELETON,
        title,
        jobTitle: user.jobTitle ? user.jobTitle : "",
        bio: user.bio ? user.bio : "",
        templateId: selectedTemplateId,
        ...styles,
        priority: getResumes().length + 1,
        data: {
          categories,
          contactInfo: [],
        },
      },
    }).then(
      (data) => {
        console.info("CREATE_RESUME data", data);
        createResume(data.createResume);
        setEditingResume(data.createResume);
        setChangingResume(true);
        storeStatus("");
        resetPopups();
      },
      (err) => {
        console.error("err", err);
        toast.error(`⚠️ ${err}`);
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
    setTemplates(TEMPLATES);
  }, []);
  return (
    <ReactModal
      className="popup"
      isOpen={true}
      overlayClassName="popup-container"
      onRequestClose={handleCancel}
    >
      <div className="popup__header">
        <h4 className="popup__header--title">Create resume</h4>
        <i
          onClick={handleCancel}
          className={`fa fa-close popup__header--close`}
        ></i>
      </div>
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
              <Template
                template={template}
                key={`resumePopup-${template.id}`}
              />
            ))
          ) : (
            <p>Loading templates...</p>
          )}
          <br />
          <Button text="Create" altText="Creating..." fn={handleCreate} />
        </div>
      </form>
    </ReactModal>
  );
};

export default ResumePopup;
