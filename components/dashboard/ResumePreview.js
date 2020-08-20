import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { fauna } from "../../lib/api";
import Resume from "./Resume";
import { getTemplate } from "../../templates/templates";

const ResumePreview = ({ resume, index }) => {
  const {
    getUser,
    setEditingResume,
    getResumes,
    setChangingResume,
    moveResume,
    forceRender,
    storeResume,
  } = useContext(UserContext);
  const handleClick = (e, resume) => {
    e.preventDefault();
    setEditingResume(resume);
    setChangingResume(true);
  };
  const handleDuplicate = (e, resume) => {
    e.stopPropagation();
    const title = resume.title + " Duplicate";
    const priority = getResumes().length + 1;
    fauna({
      type: "DUPLICATE_RESUME",
      userId: getUser()._id,
      resumeData: resume,
      title,
      priority,
    }).then((data) => {
      storeResume(data.createResume, { add: true });
    });
  };
  const handleMove = (e, resume, amount) => {
    e.stopPropagation();
    moveResume(resume, amount);
    forceRender();
  };
  return (
    <div
      className="resume-preview resume--hoverable"
      key={resume._id}
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
          <a onClick={(e) => handleDuplicate(e, resume)}>Create variation</a>
          {index !== 0 && (
            <>
              <i> - </i>
              <a onClick={(e) => handleMove(e, resume, -1)}>Move up</a>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ResumePreview;
