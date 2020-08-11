import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import Category from "./Category";
import ContactItem from "./ContactItem";
import { PDFExport } from "@progress/kendo-react-pdf";

// PDF Export source
// https://blog.usejournal.com/lets-make-a-resume-in-react-2c9c5540f51a

const Resume = ({ tiny, template }) => {
  const {
    getUser,
    setEditingCategory,
    editingResume,
    setChangingInfo,
    preview,
    setPdf,
  } = useContext(UserContext);
  const handleChangeInfo = () => {
    if (preview) return false;
    setChangingInfo(true);
  };
  const templateCSS = template ? template : editingResume.template;
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
          {editingResume.jobTitle || "Job Title"}
        </h3>
        <p className="resume__header--bio multiline">
          {editingResume.bio || "Bio"}
        </p>
      </div>
    );
  };
  const drawContactInfo = () => {
    return (
      <div className="resume__contact-info">
        <div className="resume__contact-info__content">
          {sortByPriority(editingResume.contactInfo.data).map((item) => (
            <ContactItem item={item} key={`${item.name}-${item.value}`} />
          ))}
          {!preview && <ContactItem item={{}} txt={"Add contact info"} />}
        </div>
      </div>
    );
  };
  const drawCategories = () => {
    if (!editingResume.categories) return <p>Nothing here yet</p>;

    const categories = sortByPriority(editingResume.categories.data);
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
          <p onClick={handleNewCategory}>
            <i className="resume--hoverable">Create category</i>
          </p>
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
    <PDFExport
      paperSize={"A4"}
      fileName={editingResume.title + ".pdf"}
      title={editingResume.title}
      subject=""
      keywords=""
      ref={(r) => setPdf(r)}
    >
      <div
        className={"resume-container " + (tiny ? "resume-container--tiny" : "")}
      >
        <style>{templateCSS.style}</style>
        <div
          className={
            "resume " + (templateCSS.name + " ") + (tiny ? "resume--tiny" : "")
          }
        >
          {drawHeader()}
          {drawContactInfo()}
          {drawCategories()}
        </div>
      </div>
    </PDFExport>
  );
};

export default Resume;
