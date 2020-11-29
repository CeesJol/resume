import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import Category from "./Category";
import ContactItem from "./ContactItem";
import { PDFExport } from "@progress/kendo-react-pdf";
import { getTemplate } from "../../templates/templates";
import { isMobile } from "react-device-detect";
import Button from "../general/Button";
import { getDummyItem, sortByPriority } from "../../lib/constants";

// PDF Export source
// https://blog.usejournal.com/lets-make-a-resume-in-react-2c9c5540f51a

/**
 * Container for the resume.
 * Functionality:
 * - Draws each item of the resume
 * - "tiny": a smaller version, used in Template and ResumePreview
 * - "template": specifies which template the resume uses (eg. SimpleGreen)
 * - "exportpdf": add ExportPDF element if true
 * Styling:
 * - Sets width and height of the resume
 */
const Resume = ({ resume, tiny, template, exportpdf }) => {
  const {
    user,
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
    setEditingContactInfo,
  } = useContext(UserContext);
  const curResume = resume || editingResume;
  const [hovering, setHovering] = useState(false);
  const handleChangeInfo = () => {
    if (preview) return false;
    setChangingInfo(true);
  };
  const templateCSS = template
    ? template
    : getTemplate(editingResume.templateId);
  const drawCategory = (category, index) => {
    return (
      <Category
        key={`category-${category._id || category.name}`}
        category={category}
        index={index}
        primaryColor={curResume.primaryColor}
        backgroundColor={curResume.backgroundColor}
      />
    );
  };
  const drawHeader = () => {
    return (
      <div
        className={`resume__header resume__container ${
          !preview && !isMobile ? "resume--hoverable" : ""
        }`}
        onClick={handleChangeInfo}
        style={{
          backgroundColor: curResume.backgroundColor,
        }}
      >
        <h1 className="resume__header--name">
          {userExists() && user.username}
        </h1>
        <h3 className="resume__header--job-title">{getJobTitle(curResume)}</h3>
        <p className="resume__header--bio multiline">{getBio(curResume)}</p>
      </div>
    );
  };
  const drawContactInfo = () => {
    if (templateCSS.contactInfo === "SIDEBAR") {
      // Draw as category
      return (
        <div
          className={`resume__category ${
            !preview && !isMobile ? "resume__category--hoverable" : ""
          }`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {hovering && !isMobile && !preview && (
            <span className="resume__actions">
              <Button
                fn={() => setEditingContactInfo({})}
                text={`Add contact info`}
                textual={true}
              />
            </span>
          )}
          <h3
            className="resume__category--name"
            style={{
              color: curResume.primaryColor,
            }}
          >
            Personal info
          </h3>
          {getContactInfo(curResume).length > 0 || preview ? (
            drawContactInfoItems()
          ) : (
            <ContactItem
              template={templateCSS}
              item={getDummyItem("Contact info")}
              primaryColor={curResume.primaryColor}
              dummy={true}
            />
          )}
        </div>
      );
    }
    // Draw at top
    return (
      <div
        className="resume__contact-info"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="resume__contact-info__content">
          {templateCSS.contactInfo === "SIDEBAR" && (
            <h3
              className="resume__category--name"
              style={{
                color: curResume.primaryColor,
              }}
            >
              Personal info
            </h3>
          )}
          {drawContactInfoItems()}
          <span>
            {true && !preview && !isMobile && (
              <ContactItem
                template={templateCSS}
                item={{}}
                text={"Add contact info"}
                primaryColor={curResume.primaryColor}
              />
            )}
          </span>
        </div>
      </div>
    );
  };
  const drawContactInfoItems = () => {
    return sortByPriority(getContactInfo(curResume)).map((item) => (
      <ContactItem
        template={templateCSS}
        item={item}
        key={`contactItem-${item.name}-${item.value}`}
        primaryColor={curResume.primaryColor}
      />
    ));
  };
  const drawCategories = () => {
    if (!getCategories(curResume)) return <p>Nothing here yet</p>;

    const categories = sortByPriority(getCategories(curResume));

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
          {!preview && !isMobile && (
            <>
              <span className="resume--hoverable" onClick={handleNewCategory}>
                <p className="resume--action">Create new category</p>
              </span>
              {sidebarCategories.length === 0 && (
                <span
                  className="resume--hoverable"
                  onClick={() => handleNewCategory({ sidebar: true })}
                >
                  <p className="resume--action">
                    Create new category in sidebar
                  </p>
                </span>
              )}
            </>
          )}
        </div>
      );
    }

    return (
      <>
        <div
          className={`resume__container resume__container--left ${
            templateCSS.sidebar > 50 ? "resume__container--small" : ""
          }`}
        >
          {mainCategories.map((category, index) =>
            drawCategory(category, index)
          )}
          {!preview && !isMobile && (
            <span className="resume--hoverable" onClick={handleNewCategory}>
              <p className="resume--action">Create new category</p>
            </span>
          )}
        </div>
        <div
          className={`resume__container resume__container--right ${
            templateCSS.sidebar < 50 ? "resume__container--small" : ""
          }`}
        >
          {templateCSS.contactInfo === "SIDEBAR" && drawContactInfo()}
          {sidebarCategories.map((category, index) =>
            drawCategory(category, index)
          )}
          {!preview && !isMobile && (
            <span
              className="resume--hoverable"
              onClick={() => handleNewCategory({ sidebar: true })}
            >
              <p className="resume--action">Create new category</p>
            </span>
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
