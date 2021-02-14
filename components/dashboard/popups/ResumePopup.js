import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Template from "../Template";
import { toastError } from "../../../lib/error";
import { fauna } from "../../../lib/api";
import { TEMPLATES, getTemplate } from "../../../templates/templates";
import {
  DEFAULT_CATEGORIES,
  convertToTemplate,
  RESUME_DEFAULTS,
} from "../../../lib/constants";
import ReactModal from "react-modal";
import CloseButton from "../CloseButton";
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
    resumes,
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
  const checkInvalidInput = () => {
    const validationError = validateInput();
    if (validationError) {
      toastError(validationError);
      return true;
    }
    return false;
  };
  const handleCreate = async () => {
    if (checkInvalidInput()) return;

    // Set whether to show value depending on resume property
    const template = getTemplate(selectedTemplateId);
    const styles = getTemplate(selectedTemplateId).styles;

    const resumeData = convertToTemplate(
      {
        ...RESUME_DEFAULTS,
        title,
        username: user.username,
        jobTitle: user.jobTitle ? user.jobTitle : "",
        bio: user.bio ? user.bio : "",
        templateId: selectedTemplateId,
        ...styles,
        priority: resumes.length + 1,
        data: {
          categories: DEFAULT_CATEGORIES,
          contactInfo: [],
        },
      },
      template
    );

    await fauna({
      type: "CREATE_RESUME",
      userId: user._id,
      data: resumeData,
    }).then(
      (data) => {
        // Convert resume data
        data.createResume.data = JSON.parse(data.createResume.data);
        console.info("CREATE_RESUME data", data);
        createResume(data.createResume);
        setEditingResume(data.createResume);
        setChangingResume(true);
        resetPopups();
      },
      (err) => {
        console.error("err", err);
        toastError(err);
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
        <CloseButton fn={handleCancel} />
      </div>
      <form>
        <div>
          <label>Resume Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChangeTitle}
            placeholder={`${user.username}'s Resume`}
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
