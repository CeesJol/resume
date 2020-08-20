import React, { useContext, useState, useEffect } from "react";
import { fauna } from "../../lib/api";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { toast } from "react-toastify";
import Template from "./Template";
import { TEMPLATES } from "../../templates/templates";

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
  } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    setPreview(true);

    setSelectedTemplateId(editingResume.templateId);

    // load layout
    if (!filled && editingResume !== -1) {
      setFilled(true);

      // Object spread to avoid shallow copy
      setItems({ ...getLayout() });
    }

    setTemplates(TEMPLATES);
  }, []);
  const handleChangeItem = (i) => {
    let newArr = [...items];
    newArr[i].value = event.target.value;
    setItems(newArr);
  };
  const handleUpdateLayout = async (item) => {
    await fauna({
      type: "UPDATE_LAYOUT",
      id: item._id,
      data: {
        value: item.value,
      },
    }).then(
      (data) => {
        storeLayout(data.updateLayout);
        toast.success("💾 Updated layout successfully!");
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("updateLayout err:", err);
      }
    );
  };
  const handleUpdateTemplate = async () => {
    await fauna({
      type: "UPDATE_RESUME",
      id: editingResume._id,
      data: { templateId: selectedTemplateId },
    }).then(
      (data) => {
        storeResume(data.updateResume, {});
        toast.success("💾 Updated template successfully!");
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("updateResumeTemplate err:", err);
      }
    );
  };
  const drawTemplates = () => (
    <div className="dashboard__item">
      <h4>Template</h4>
      {templates.length > 0 ? (
        <>
          {templates.map((template, i) => (
            <Template template={template} key={template.id} />
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
        <p>Loading...</p>
      )}
    </div>
  );
  const drawLayout = () =>
    items.map((item, i) => (
      <div className="dashboard__item" key={item._id}>
        <h4>{item.name}</h4>
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
