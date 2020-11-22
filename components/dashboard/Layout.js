import React, { useContext, useState, useEffect } from "react";
import { fauna } from "../../lib/api";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import Template from "./Template";
import { TEMPLATES, getTemplate } from "../../templates/templates";
import { SketchPicker } from "react-color";

const Layout = () => {
  const {
    editingResume,
    storeResume,
    templates,
    setTemplates,
    setPreview,
    selectedTemplateId,
    setSelectedTemplateId,
    storeStatus,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [items, setItems] = useState([]);
  const handleChangePrimaryColor = (color) => {
    setItems({
      ...items,
      primaryColor: color.hex,
    });
  };
  const handleChangeBackgroundColor = (color) => {
    setItems({
      ...items,
      backgroundColor: color.hex,
    });
  };
  useEffect(() => {
    setPreview(true);

    setSelectedTemplateId(editingResume.templateId);

    // load layout
    if (!filled && editingResume) {
      setFilled(true);

      setItems({
        primaryColor: editingResume.primaryColor,
        backgroundColor: editingResume.backgroundColor,
      });
    }

    setTemplates(TEMPLATES);
  }, []);
  const handleResetLayout = async (key) => {
    const value = getTemplate(editingResume.templateId).styles[key];

    // Store in Layout tab
    let newItems = items;
    newItems[key] = value;
    setItems(newItems);

    await handleUpdateLayout(key, value);
  };
  const handleUpdateLayout = async (key, value) => {
    let myData = {
      _id: editingResume._id,
    };
    myData[key] = value;

    storeResume(myData, {});

    await fauna({
      type: "UPDATE_RESUME",
      id: editingResume._id,
      data: myData,
    }).then(
      () => storeStatus("Saved."),
      (err) => storeStatus(`Error: failed to save: ${err}`)
    );
  };
  const handleUpdateTemplate = async () => {
    const styles = getTemplate(selectedTemplateId).styles;
    const myData = {
      templateId: selectedTemplateId,
      _id: editingResume._id,
      ...styles,
    };

    storeResume(myData, {});

    await fauna({
      type: "UPDATE_RESUME",
      id: editingResume._id,
      data: myData,
    }).then(
      () => {
        storeStatus("Saved.");
        // Store in textfields
        setItems({
          ...items,
          ...styles,
        });
      },
      (err) => storeStatus(`Error: failed to save: ${err}`)
    );
  };
  const drawTemplates = () => (
    <div className="dashboard__item">
      <h4 className="dashboard__item--title">Template</h4>
      {templates.length > 0 ? (
        <>
          {templates.map((template) => (
            <Template template={template} key={`template-${template.id}`} />
          ))}
          {/* <br > to force button on new line */}
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
  if (!editingResume) return <p>Select a resume to edit the layout</p>;
  return (
    <>
      {drawTemplates()}

      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Primary Color</h4>
        <form>
          <SketchPicker
            color={items.primaryColor}
            onChangeComplete={handleChangePrimaryColor}
          />

          <Button
            text="Update"
            altText="Updating..."
            fn={() => handleUpdateLayout("primaryColor", items.primaryColor)}
          />
          <Button
            text="Reset"
            altText="Resetting..."
            color="red"
            fn={() => handleResetLayout("primaryColor")}
          />
        </form>
      </div>

      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Background Color</h4>
        <form>
          <SketchPicker
            color={items.backgroundColor}
            onChangeComplete={handleChangeBackgroundColor}
          />

          <Button
            text="Update"
            altText="Updating..."
            fn={() =>
              handleUpdateLayout("backgroundColor", items.backgroundColor)
            }
          />
          <Button
            text="Reset"
            altText="Resetting..."
            color="red"
            fn={() => handleResetLayout("backgroundColor")}
          />
        </form>
      </div>
    </>
  );
};

export default Layout;
