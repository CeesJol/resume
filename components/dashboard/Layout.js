import React, { useContext, useState, useEffect } from "react";
import { fauna } from "../../lib/api";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import Template from "./Template";
import { TEMPLATES, getTemplate } from "../../templates/templates";
// import { cloneDeep } from "lodash";

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
  const handleChangeItem = (event) => {
    setItems({
      ...items,
      [event.target.name]: event.target.value,
    });
  };
  useEffect(() => {
    setPreview(true);

    setSelectedTemplateId(editingResume.templateId);

    // load layout
    if (!filled && editingResume !== -1) {
      setFilled(true);

      // cloneDeep to avoid shallow copy
      // setItems(cloneDeep(getLayout()));
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
      (err) => storeStatus("Error: failed to save", err)
    );
  };
  const handleUpdateTemplate = async () => {
    const myData = {
      templateId: selectedTemplateId,
      _id: editingResume._id,
    };

    storeResume(myData, {});

    await fauna({
      type: "UPDATE_RESUME",
      id: editingResume._id,
      data: myData,
    }).then(
      () => storeStatus("Saved."),
      (err) => storeStatus("Error: failed to save", err)
    );
  };
  const drawTemplates = () => (
    <div className="dashboard__item">
      <h4 className="dashboard__item--title">Template</h4>
      {templates.length > 0 ? (
        <>
          {templates.map((template) => (
            <Template template={template} key={`Template-${template.id}`} />
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
  return editingResume !== -1 ? (
    <>
      {drawTemplates()}

      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Primary Color</h4>
        <form>
          <input
            type="text"
            id="primaryColor"
            name="primaryColor"
            value={items.primaryColor}
            onChange={handleChangeItem}
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
          <input
            type="text"
            id="backgroundColor"
            name="backgroundColor"
            value={items.backgroundColor}
            onChange={handleChangeItem}
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
  ) : (
    <p>Select a resume to edit the layout</p>
  );
};

export default Layout;
