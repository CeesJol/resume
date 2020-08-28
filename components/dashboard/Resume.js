import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import Category from "./Category";
import ContactItem from "./ContactItem";
import { PDFExport } from "@progress/kendo-react-pdf";
import { getTemplate } from "../../templates/templates";

// PDF Export source
// https://blog.usejournal.com/lets-make-a-resume-in-react-2c9c5540f51a

const Resume = ({ resume, tiny, template, exportpdf }) => {
  const {
    getUser,
    userExists,
    setEditingCategory,
    editingResume,
    setChangingInfo,
    preview,
    setPdf,
    getCategories,
    getContactInfo,
    getJobTitle,
    getBio,
  } = useContext(UserContext);
  const handleChangeInfo = () => {
    if (preview) return false;
    setChangingInfo(true);
  };
  const templateCSS = template
    ? template
    : getTemplate(editingResume.templateId);
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
          {userExists() && getUser().username}
        </h1>
        <h3 className="resume__header--job-title">{getJobTitle(resume)}</h3>
        <p className="resume__header--bio multiline">{getBio(resume)}</p>
      </div>
    );
  };
  const drawContactInfo = () => {
    return (
      <div className="resume__contact-info">
        <div className="resume__contact-info__content">
          {templateCSS.contactInfo === "SIDEBAR" && (
            <h3 className="resume__category--name">Personal info</h3>
          )}
          {sortByPriority(getContactInfo(resume)).map((item) => (
            <ContactItem
              template={templateCSS}
              item={item}
              key={`${item.name}-${item.value}`}
            />
          ))}
          <span>
            {!preview && (
              <ContactItem
                template={templateCSS}
                item={{}}
                txt={"Add contact info"}
              />
            )}
          </span>
        </div>
      </div>
    );
  };
  const drawCategories = () => {
    if (!getCategories(resume)) return <p>Nothing here yet</p>;

    const categories = sortByPriority(getCategories(resume));

    const mainCategories = categories.filter((category) => !category.sidebar);
    const sidebarCategories = categories.filter((category) => category.sidebar);

    // If the template draws contact info at the top (so not in the sidebar)
    // If the template has no sidebar or there are no items in the sidebar,
    // don't draw it
    if (
      templateCSS.contactInfo === "TOP" &&
      (!templateCSS.sidebar || sidebarCategories.length === 0)
    ) {
      return (
        <div className="resume__container">
          {categories.map((category, index) => drawCategory(category, index))}
          {!preview && (
            <>
              <p className="resume--hoverable" onClick={handleNewCategory}>
                <i>Create new category</i>
              </p>
              {sidebarCategories.length === 0 && (
                <p
                  className="resume--hoverable"
                  onClick={() => handleNewCategory({ sidebar: true })}
                >
                  <i>Create new category in sidebar</i>
                </p>
              )}
            </>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="resume__container resume__container--left">
          {mainCategories.map((category, index) =>
            drawCategory(category, index)
          )}
          {!preview && (
            <p className="resume--hoverable" onClick={handleNewCategory}>
              <i>Create new category</i>
            </p>
          )}
        </div>
        <div className="resume__container resume__container--right">
          {templateCSS.contactInfo === "SIDEBAR" && drawContactInfo()}
          {sidebarCategories.map((category, index) =>
            drawCategory(category, index)
          )}
          {!preview && (
            <p
              className="resume--hoverable"
              onClick={() => handleNewCategory({ sidebar: true })}
            >
              <i>Create new category</i>
            </p>
          )}
        </div>
      </>
    );
  };
  const handleNewCategory = ({ sidebar }) => {
    if (preview) return false;
    setEditingCategory({ sidebar: sidebar ? true : false });
  };
  const result = (
    <div
      className={"resume-container " + (tiny ? "resume-container--tiny" : "")}
    >
      <div
        className={
          "resume " + (templateCSS.id + " ") + (tiny ? "resume--tiny" : "")
        }
      >
        {drawHeader()}
        {templateCSS.contactInfo === "TOP" && drawContactInfo()}
        <div className="resume__body">{drawCategories()}</div>
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
      scale={1} // Note: also change scale in _settings.scss!
    >
      {result}
    </PDFExport>
  ) : (
    result
  );
};

export default Resume;
