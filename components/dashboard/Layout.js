import React, { useContext, useState, useEffect } from "react";
import { fauna } from "../../lib/api";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import Template from "./Template";
import { TEMPLATES } from "../../templates/templates";
import { cloneDeep } from "lodash";

const Layout = () => {
  const {
    editingResume,
    storeLayout,
    storeResume,
    getLayout,
    templates,
    setTemplates,
    setPreview,
    selectedTemplateId,
    setSelectedTemplateId,
    storeStatus,
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    setPreview(true);

    setSelectedTemplateId(editingResume.templateId);

    // load layout
    if (!filled && editingResume !== -1) {
      setFilled(true);

      // cloneDeep to avoid shallow copy
      setItems(cloneDeep(getLayout()));
    }

    setTemplates(TEMPLATES);
  }, []);
  const handleChangeItem = (i) => {
    let newArr = [...items];
    newArr[i].value = event.target.value;
    setItems(newArr);
  };
  const handleUpdateLayout = async (item) => {
    const myData = {
      value: item.value,
      _id: item._id,
    };

    storeLayout(myData);

    await fauna({
      type: "UPDATE_LAYOUT",
      id: item._id,
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
            <Template template={template} key={`Layout-${template.id}`} />
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
  const drawLayout = () =>
    items.map((item, i) => (
      <div className="dashboard__item" key={item._id}>
        <h4 className="dashboard__item--title">{item.name}</h4>
        <form>
          <input
            type="text"
            id="value"
            name="value"
            value={item.value}
            onChange={() => handleChangeItem(i)}
          />

          <Button
            text="Update"
            altText="Updating..."
            fn={() => handleUpdateLayout(item)}
          />
        </form>
      </div>
    ));
  return editingResume !== -1 ? (
    <>
      {drawTemplates()}
      {drawLayout()}
    </>
  ) : (
    <p>Select a resume to edit the layout</p>
  );
};

export default Layout;
