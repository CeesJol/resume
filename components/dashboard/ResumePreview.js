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
    getResumes,
    setChangingResume,
    moveResume,
    forceRender,
    createResume,
    storeStatus,
  } = useContext(UserContext);
  const handleClick = (e, resume) => {
    e.preventDefault();
    setEditingResume(resume);
    setChangingResume(true);
  };
  const handleDuplicate = async (resume) => {
    const title = resume.title + " Duplicate";
    const priority = getResumes().length + 1;
    await fauna({
      type: "DUPLICATE_RESUME",
      userId: user._id,
      resumeData: resume,
      title,
      priority,
    }).then((data) => {
      // Convert resume data
      data.createResume.data = JSON.parse(data.createResume.data);
      createResume(data.createResume);
      storeStatus("");
      forceRender();
    });
  };
  const handleMove = async (resume, amount) => {
    await moveResume(resume, amount);
    forceRender();
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
        <h3 className="resume-preview__body--title">{resume.title}</h3>
        <h3 className="resume-preview__body--job-title">
          {resume.jobTitle || "Job Title"}
        </h3>

        <footer>
          <span onClick={(event) => event.stopPropagation()}>
            <Button
              fn={() => handleDuplicate(resume)}
              text="Create variation"
              altText="Creating..."
              textual={true}
            />
          </span>

          {index > 0 && (
            <>
              <Separator />
              <span onClick={(event) => event.stopPropagation()}>
                <Button
                  fn={() => handleMove(resume, -1)}
                  text="Move up"
                  altText="Moving..."
                  textual={true}
                />
              </span>
            </>
          )}
          {index < getResumes().length - 1 && (
            <>
              <Separator />
              <span onClick={(event) => event.stopPropagation()}>
                <Button
                  fn={() => handleMove(resume, 1)}
                  text="Move down"
                  altText="Moving..."
                  textual={true}
                />
              </span>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ResumePreview;
