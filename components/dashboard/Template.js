import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Resume from "./Resume";
import { getDummyResume } from "../../lib/constants";

const Template = ({ template }) => {
  const { selectedTemplateId, setSelectedTemplateId } = useContext(UserContext);
  const handleClick = (e, templateId) => {
    e.preventDefault();
    setSelectedTemplateId(templateId);
  };
  const isSelected = () => {
    // If the user is creating a resume and clicked this template
    // Used to give a color to the selected template
    return template.id === selectedTemplateId;
  };
  const getTemplateClassName = () => {
    let className = "box";
    if (isSelected()) {
      className += " box--selected";
    }
    return className;
  };
  return (
    <div
      className={getTemplateClassName()}
      onClick={(e) => handleClick(e, template.id)}
    >
      <Resume
        resume={getDummyResume(template)}
        tiny={true}
        template={template}
      />
      <p className="box--title">{template.name}</p>
    </div>
  );
};

export default Template;
