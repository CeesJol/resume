import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import Resume from "./Resume";

const Template = ({ template }) => {
  const {
    selectedTemplateId,
    setSelectedTemplateId,
    editingResume,
    changingResume,
  } = useContext(UserContext);
  const handleClick = (e, templateId) => {
    e.preventDefault();
    setSelectedTemplateId(templateId);
  };
  const isSelected = () => {
    // If the user is creating a resume and clicked this template
    if (template._id === selectedTemplateId) return true;

    return false;
  };
  return (
    <div
      className={"box " + (isSelected() ? "box--selected" : "")}
      onClick={(e) => handleClick(e, template._id)}
    >
      <Resume tiny={true} template={template} />
      <p className="box--title">{template.name}</p>
    </div>
  );
};

export default Template;
