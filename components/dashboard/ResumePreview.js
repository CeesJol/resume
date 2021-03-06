import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { fauna } from "../../lib/api";
import Resume from "./Resume";
import { getTemplate } from "../../templates/templates";
import Separator from "./Separator";

/**
 * Show a preview of a resume in the main page of the dashboard.
 * Functionality:
 * - Show a preview of the resume
 * - Duplicating resume
 * - Moving resume
 * - Clicking a resume to edit it
 * Styling:
 * -
 */
const ResumePreview = ({ resume, index }) => {
  const {
    user,
    setEditingResume,
    resumes,
    setChangingResume,
    moveResume,
    forceRender,
    createResume,
  } = useContext(UserContext);
  const handleClick = (e, resume) => {
    e.preventDefault();
    setEditingResume(resume);
    setChangingResume(true);
  };
  const handleDuplicate = async (resume) => {
    const data = {
      ...resume,
      title: resume.title + " Duplicate",
      priority: resumes.length + 1,
    };
    await fauna({
      type: "DUPLICATE_RESUME",
      userId: user._id,
      data,
    }).then((data) => {
      // Convert resume data
      data.createResume.data = JSON.parse(data.createResume.data);
      createResume(data.createResume);
      forceRender();
    });
  };
  const handleMove = async (resume, amount) => {
    await moveResume(resume, amount);
    forceRender();
  };
  const drawResumePreviewFooter = () => {
    const drawMoveUp = () => (
      <>
        <Separator large={true} />
        <Button
          fn={() => handleMove(resume, -1)}
          text="Move up"
          altText="Moving..."
          textual="large"
        />
      </>
    );
    const drawMoveDown = () => (
      <>
        <Separator large={true} />
        <Button
          fn={() => handleMove(resume, 1)}
          text="Move down"
          altText="Moving..."
          textual="large"
        />
      </>
    );
    return (
      <footer>
        <span onClick={(event) => event.stopPropagation()}>
          <Button
            fn={() => handleDuplicate(resume)}
            text="Create variation"
            altText="Creating..."
            textual="large"
          />
          {index > 0 && drawMoveUp()}
          {index < resumes.length - 1 && drawMoveDown()}
        </span>
      </footer>
    );
  };
  return (
    <div
      className="resume-preview resume--hoverable"
      key={`resumePreview-${resume._id}`}
      onClick={(e) => handleClick(e, resume)}
    >
      <div className="resume-preview__head">
        <Resume
          noscale={true}
          tiny={true}
          template={getTemplate(resume.templateId)}
          resume={resume}
        />
      </div>
      <div className="resume-preview__body">
        <div className="resume-preview--content">
          <h3 className="resume-preview__body--title">{resume.title}</h3>
          <h3 className="resume-preview__body--job-title">
            {resume.jobTitle || "Job Title"}
          </h3>

          {drawResumePreviewFooter()}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
