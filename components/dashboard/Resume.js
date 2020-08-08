import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import Category from "./Category";
import ContactItem from "./ContactItem";

import { PDFExport } from "@progress/kendo-react-pdf";

export default ({ data }) => {
  const resume = () => {
    // console.log('data', data, !!data)
    if (data) return data;
    return editingResume;
  };
  const {
    getUser,
    setEditingCategory,
    editingResume,
    setChangingInfo,
    preview,
  } = useContext(UserContext);

  const [res, setRes] = useState(null);
  const exportPDF = () => {
    res.save();
  };

  const handleChangeInfo = () => {
    if (preview) return false;
    setChangingInfo(true);
  };
  const templateCSS = resume().template.style;
  const sortByPriority = (list) => {
    return list.sort((item1, item2) => {
      return item1.priority < item2.priority ? -1 : 1;
    });
  };
  const drawCategory = (category, index) => {
    return <Category key={category._id} category={category} index={index} />;
  };
  const drawHeader = () => {
    return (
      <div
        className={`resume__header resume__container ${
          !preview ? "resume--hoverable" : ""
        }`}
        onClick={handleChangeInfo}
      >
        <h1 className="resume__header--name">
          {getUser() && getUser().username}
        </h1>
        <h3 className="resume__header--job-title">
          {resume().jobTitle || "Job title"}
        </h3>
        <p className="resume__header--bio multiline">{resume().bio || "Bio"}</p>
      </div>
    );
  };
  const drawContactInfo = () => {
    return (
      <div className="resume__contact-info">
        <div className="resume__contact-info__content">
          {sortByPriority(resume().contactInfo.data).map((item) => (
            <ContactItem item={item} key={`${item.name}-${item.value}`} />
          ))}
          {!preview && <ContactItem item={{}} txt={"Add contact info"} />}
        </div>
      </div>
    );
  };
  const drawItems = () => {
    if (!resume().categories) return <p>Nothing here yet</p>;

    const categories = sortByPriority(resume().categories.data);
    // if (editingResume.template.sidebar) {
    //   const mainCategories = categories.filter(
    //     (category) => category.priority < 1000
    //   );
    //   const sidebarCategories = categories.filter(
    //     (category) => category.priority >= 1000
    //   );

    //   return (
    //     <>
    //       <div className="resume__container">
    //         {mainCategories.map((category, index) => drawCategory(category, index))}
    //       </div>
    //       <div className="resume__container">
    //         {sidebarCategories.map((category, index) => drawCategory(category, index))}
    //       </div>
    //     </>
    //   );
    // } else {
    return (
      <div className="resume__container">
        {categories.map((category, index) => drawCategory(category, index))}
        {!preview && (
          <a onClick={handleNewCategory}>
            <i>Create category</i>
          </a>
        )}
      </div>
    );
    // }
  };
  const handleNewCategory = () => {
    if (preview) return false;
    setEditingCategory({});
  };
  return (
    <>
      <PDFExport
        paperSize={"Letter"}
        fileName="_____.pdf"
        title=""
        subject=""
        keywords=""
        ref={(r) => setRes(r)}
      >
        <div className="resume">
          <style>{templateCSS}</style>
          {drawHeader()}
          {drawContactInfo()}
          {drawItems()}
        </div>
      </PDFExport>
      <button onClick={exportPDF}>download</button>
    </>
  );
};
