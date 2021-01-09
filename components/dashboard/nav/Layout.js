import React, { useContext, useState, useEffect } from "react";
import { fauna } from "../../../lib/api";
import { RESUME_DEFAULTS } from "../../../lib/constants";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import Template from "../Template";
import { TEMPLATES, getTemplate } from "../../../templates/templates";
import { SketchPicker } from "react-color";

const Layout = () => {
  const {
    editingResume,
    updateResume,
    templates,
    setTemplates,
    setPreview,
    selectedTemplateId,
    setSelectedTemplateId,
    storeStatus,
    setWarning,
  } = useContext(UserContext);
  const [fields, setFields] = useState({
    primaryColor: "",
    backgroundColor: "",
    fontSize: RESUME_DEFAULTS.fontSize,
  });
  const storeFields = (newFields) =>
    setFields({
      ...fields,
      ...newFields,
    });
  const handleChange = (event) => {
    storeFields({
      [event.target.name]: event.target.value,
    });
  };
  const handleChangePrimaryColor = (color) => {
    storeFields({
      primaryColor: color.hex,
    });
  };
  const handleChangeBackgroundColor = (color) => {
    storeFields({
      backgroundColor: color.hex,
    });
  };
  const handleResetLayout = async (key) => {
    // Get the default value of the template, otherwise of the RESUME_DEFAULTS
    const value =
      getTemplate(editingResume.templateId).styles[key] || RESUME_DEFAULTS[key];

    // Store in Layout tab
    let newFields = fields;
    newFields[key] = value;
    setFields(newFields);

    await handleUpdateLayout(key, value);
  };
  const handleUpdateLayout = async (key, value) => {
    let myData = {
      _id: editingResume._id,
    };
    myData[key] = value;

    updateResume(myData);
  };
  const handleUpdateTemplate = async () => {
    setWarning({
      text:
        "Are you sure you want to update your template? Any custom colors will be replaced with this template's colors.",
      fn: async () => {
        const styles = getTemplate(selectedTemplateId).styles;
        const myData = {
          templateId: selectedTemplateId,
          _id: editingResume._id,
          ...styles,
        };
        updateResume(myData);
        storeFields(styles);
      },
    });
  };
  const drawTemplates = () => (
    <div className="dashboard__item">
      <h4 className="dashboard__item--title">Template</h4>
      {templates.length > 0 ? (
        <>
          {templates.map((template) => (
            <Template template={template} key={`template-${template.id}`} />
          ))}
          {/* <br /> to force button on new line */}
          <br />
          <Button
            text="Update"
            altText="Updating..."
            fn={handleUpdateTemplate}
          />
        </>
      ) : (
        <p>Loading templates...</p>
      )}
    </div>
  );
  const drawButtons = (itemName) => (
    <>
      <Button
        text="Update"
        altText="Updating..."
        fn={() => handleUpdateLayout(itemName, fields[itemName])}
      />
      <Button
        text="Reset"
        altText="Resetting..."
        color="red"
        fn={() => handleResetLayout(itemName)}
      />
    </>
  );
  const drawFontSettings = () => (
    <div className="dashboard__item">
      <h4 className="dashboard__item--title">Font settings</h4>
      <label>Font size</label>
      <input
        type="text"
        id="fontSize"
        name="fontSize"
        value={fields.fontSize}
        onChange={handleChange}
      />
      {drawButtons("fontSize")}
    </div>
  );
  const drawPrimaryColorPane = () => (
    <div className="dashboard__item">
      <h4 className="dashboard__item--title">Primary Color</h4>
      <form>
        <SketchPicker
          color={fields.primaryColor}
          onChangeComplete={handleChangePrimaryColor}
        />

        {drawButtons("primaryColor")}
      </form>
    </div>
  );
  const drawBackgroundColorPane = () => (
    <div className="dashboard__item">
      <h4 className="dashboard__item--title">Background Color</h4>
      <form>
        <SketchPicker
          color={fields.backgroundColor}
          onChangeComplete={handleChangeBackgroundColor}
        />

        {drawButtons("backgroundColor")}
      </form>
    </div>
  );
  useEffect(() => {
    setPreview(true);

    // load layout
    if (editingResume) {
      setSelectedTemplateId(editingResume.templateId);
      storeFields({
        primaryColor: editingResume.primaryColor,
        backgroundColor: editingResume.backgroundColor,
        fontSize: editingResume.fontSize || fields.fontSize,
      });
    }

    setTemplates(TEMPLATES);
  }, []);
  if (!editingResume) return <p>Select a resume to edit the layout</p>;
  return (
    <>
      {drawTemplates()}
      {drawFontSettings()}
      {drawPrimaryColorPane()}
      {drawBackgroundColorPane()}
    </>
  );
};

export default Layout;
