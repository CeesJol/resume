import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";

const Template = ({ template }) => {
  const { selectedTemplateId, setSelectedTemplateId } = useContext(
    UserContext
  );
  const handleClick = (e, templateId) => {
    e.preventDefault();
    console.log(templateId);
		setSelectedTemplateId(templateId);
  };
  return (
    <div
      className={
        "template " +
        (template._id === selectedTemplateId ? "template--selected" : "")
      }
      onClick={(e) => handleClick(e, template._id)}
    >
      <img src="/templates/1.jpg" className="template--img" />
      <p className="template--title">{template.name}</p>
      {/* <p className="template--title">{template.name}</p> */}
    </div>
  );
};

export default Template;
