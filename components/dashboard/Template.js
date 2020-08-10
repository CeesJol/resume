import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import Resume from "./Resume";

const Template = ({ template }) => {
  const { selectedTemplateId, setSelectedTemplateId } = useContext(
    UserContext
  );
  const handleClick = (e, templateId) => {
    e.preventDefault();
		setSelectedTemplateId(templateId);
  };
  return (
    <div
      className={
        "box " +
        (template._id === selectedTemplateId ? "box--selected" : "")
      }
      onClick={(e) => handleClick(e, template._id)}
    >
      {/* <img src="/templates/1.jpg" className="box--img" /> */}
			<Resume tiny={true} template={template} />
      <p className="box--title">{template.name}</p>
    </div>
  );
};

export default Template;
