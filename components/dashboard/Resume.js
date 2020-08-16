import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import Category from "./Category";
import ContactItem from "./ContactItem";
import { PDFExport } from "@progress/kendo-react-pdf";
import { SIDEBAR_INCREMENT } from "../../lib/constants";

// PDF Export source
// https://blog.usejournal.com/lets-make-a-resume-in-react-2c9c5540f51a

const Resume = ({ tiny, template, exportpdf }) => {
  const {
    getUser,
    setEditingCategory,
    editingResume,
    setChangingInfo,
    preview,
    setPdf,
    getCategories,
    getContactInfo,
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
          {sortByPriority(getContactInfo()).map((item) => (
            <ContactItem item={item} key={`${item.name}-${item.value}`} />
          ))}
          {!preview && <ContactItem item={{}} txt={"Add contact info"} />}
        </div>
      </div>
    );
  };
  const drawCategories = () => {
    if (!editingResume.categories) return <p>Nothing here yet</p>;

    const categories = sortByPriority(getCategories());
    if (editingResume.template.sidebar) {
      const mainCategories = categories.filter(
        (category) => category.priority <= SIDEBAR_INCREMENT
      );
      const sidebarCategories = categories.filter(
        (category) => category.priority > SIDEBAR_INCREMENT
      );

      return (
        <>
          <div className="resume__container resume__container--left">
            {mainCategories.map((category, index) =>
              drawCategory(category, index)
            )}
            {!preview && (
              <p onClick={handleNewCategory}>
                <i className="resume--hoverable">Create category</i>
              </p>
            )}
          </div>
          <div className="resume__container resume__container--right">
            {sidebarCategories.map((category, index) =>
              drawCategory(category, index)
            )}
            {!preview && (
              <p onClick={() => handleNewCategory({ sidebar: true })}>
                <i className="resume--hoverable">Create category</i>
              </p>
            )}
          </div>
        </>
      );
    } else {
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
    }
  };
  const handleNewCategory = ({ sidebar }) => {
    if (preview) return false;
    setEditingCategory({});
    if (sidebar) setEditingCategory({ sidebar: true });
  };
  const resume = (
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
  );
  return exportpdf ? (
    <PDFExport
      paperSize={"A4"}
      fileName={editingResume.title + ".pdf"}
      title={editingResume.title}
      subject=""
      keywords=""
      ref={(r) => setPdf(r)}
      scale={0.5}
    >
      {resume}
    </PDFExport>
  ) : (
    resume
  );
};

export default Resume;
