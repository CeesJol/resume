import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import Category from "./Category";
import ContactItem from "./ContactItem";
import { PDFExport } from "@progress/kendo-react-pdf";
import { getTemplate } from "../../templates/templates";
import Button from "../general/Button";
import { getDummyItem } from "../../lib/constants";
import { sortByPriority } from "../../lib/util";

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
    isHoverable,
    appendHoverToClassName,
  } = useContext(UserContext);
  const curResume = resume || editingResume;
  const [hovering, setHovering] = useState(false);
  const handleChangeInfo = () => {
    if (preview) return;
    setChangingInfo(true);
  };
  const templateCSS = template
    ? template
    : getTemplate(editingResume.templateId);
  const drawCategory = (category, index) => {
    return (
      <Category
        key={`category-${category.id || category.title}`}
        category={category}
        index={index}
        primaryColor={curResume.primaryColor}
        backgroundColor={curResume.backgroundColor}
      />
    );
  };
  const getHeaderClassName = () => {
    const className = "resume__header resume__container";
    return appendHoverToClassName(className);
  };
  const drawHeader = () => {
    return (
      <div
        className={getHeaderClassName()}
        onClick={handleChangeInfo}
        style={{
          backgroundColor: curResume.backgroundColor,
        }}
      >
        <h1 className="resume__header--name">
          {userExists() && user.username}
        </h1>
        <h3 className="resume__header--job-title">{getJobTitle(curResume)}</h3>
        {!templateCSS.header.bioBelowContactInfo && drawBio()}
      </div>
    );
  };
  const drawContactInfo = () => {
    if (templateCSS.contactInfo.place === "SIDEBAR") {
      const getClassName = () => {
        let className = "resume__category";
        if (isHoverable()) {
          className += " resume__category--hoverable";
        }
        return className;
      };
      const getCategoryNameStyle = () => ({
        color: curResume.primaryColor,
        fontSize: editingResume.fontSize,
      });
      // Draw as category
      return (
        <div
          className={getClassName()}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {hovering && isHoverable() && (
            <span className="resume__actions">
              <Button
                fn={() => setEditingContactInfo({})}
                text={"Add contact info"}
                textual={true}
              />
            </span>
          )}
          <h3 className="resume__category--name" style={getCategoryNameStyle()}>
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
          {templateCSS.contactInfo.place === "SIDEBAR" && (
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
            {true && isHoverable() && (
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
        key={`contactItem-${item.value}-${item.name}`}
        primaryColor={curResume.primaryColor}
      />
    ));
  };
  const drawResumeActions = (userCanAddSidebar, sidebar) => {
    if (!isHoverable()) return;
    return (
      <>
        <span
          className="resume--hoverable"
          onClick={() => handleNewCategory({ sidebar })}
        >
          <p className="resume--action">Create new category</p>
        </span>
        {userCanAddSidebar && (
          <>
            <br />
            <span
              className="resume--hoverable"
              onClick={() => handleNewCategory({ sidebar: true })}
            >
              <p className="resume--action">Create sidebar and add category</p>
            </span>
          </>
        )}
      </>
    );
  };
  const drawBio = () => (
    <p
      className="resume__header--bio multiline"
      style={{
        fontSize: editingResume.fontSize,
      }}
    >
      {getBio(curResume)}
    </p>
  );
  const drawCategories = () => {
    // TODO now you can't create a category...
    // if (!getCategories(curResume)) return <p>Nothing here yet</p>;

    const categories = sortByPriority(getCategories(curResume));

    let mainCategories, sidebarCategories, userCanAddSidebar;

    // If the template has no sidebar, put all items in mainCategories
    if (!templateCSS.sidebar) {
      mainCategories = categories;
      sidebarCategories = [];
      userCanAddSidebar = false;
    } else {
      mainCategories = categories.filter((category) => !category.sidebar);
      sidebarCategories = categories.filter((category) => category.sidebar);
      userCanAddSidebar =
        sidebarCategories.length === 0 &&
        getTemplate(editingResume.templateId).sidebar;
    }

    // If the template draws contact info at the top (so not in the sidebar)
    // If the template has no sidebar or there are no items in the sidebar,
    // don't draw it
    // if (
    //   templateCSS.contactInfo.place === "TOP" &&
    //   (!templateCSS.sidebar || sidebarCategories.length === 0)
    // ) {
    //   return (
    //     <div className="resume__container">
    //       {categories.map((category, index) => drawCategory(category, index))}
    //       {drawResumeActions(userCanAddSidebar, false)}
    //     </div>
    //   );
    // }

    return (
      <>
        <div
          className={getResumeContainerClassName("left")}
          style={{
            width: `${100 - templateCSS.sidebar}%`,
          }}
        >
          {templateCSS.header.bioBelowContactInfo && (
            <p
              className="resume__header--bio multiline"
              style={{
                fontSize: editingResume.fontSize,
              }}
            >
              {getBio(curResume)}
            </p>
          )}
          {mainCategories.map((category, index) =>
            drawCategory(category, index)
          )}
          {drawResumeActions(userCanAddSidebar, false)}
        </div>
        {!!templateCSS.sidebar && (
          <div
            className={getResumeContainerClassName("right")}
            style={{
              width: `${templateCSS.sidebar}%`,
            }}
          >
            {templateCSS.contactInfo.place === "SIDEBAR" && drawContactInfo()}
            {sidebarCategories.map((category, index) =>
              drawCategory(category, index)
            )}
            {drawResumeActions(userCanAddSidebar, true)}
          </div>
        )}
      </>
    );
  };
  const handleNewCategory = ({ sidebar }) => {
    if (preview) return;
    setEditingCategory({ sidebar: sidebar ? true : false });
  };
  const getResumeContainerClassName = (leftOrRight) => {
    let className = `resume__container resume__container--${leftOrRight}`;
    if (
      (leftOrRight === "left" && templateCSS.sidebar > 50) ||
      (leftOrRight === "right" && templateCSS.sidebar < 50)
    ) {
      className += " resume__container--small";
    }
    return className;
  };
  const getResumeParentClassName = () => {
    let className = "resume-parent";
    if (tiny) {
      className += " resume-parent--tiny";
    }
    return className;
  };
  const getResumeClassName = () => {
    let className = "resume " + templateCSS.id;
    if (tiny) {
      className += " resume--tiny";
    }
    return className;
  };
  const result = (
    <div className={getResumeParentClassName()}>
      <div className={getResumeClassName()}>
        {drawHeader()}
        {templateCSS.contactInfo.place === "TOP" && drawContactInfo()}
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
