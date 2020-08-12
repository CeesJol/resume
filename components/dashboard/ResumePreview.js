import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { duplicateResume } from "../../pages/api/fauna";

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
    duplicateResume(getUser().id, resume, title, priority).then((data) => {
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
      className="dashboard__resume-preview resume--hoverable"
      key={resume._id}
      onClick={(e) => handleClick(e, resume)}
    >
      <h3 className="dashboard__resume-preview--title">{resume.title}</h3>
      <h3 className="dashboard__resume-preview--job-title">
        {resume.jobTitle || "Job Title"}
      </h3>
      <p className="dashboard__resume-preview--bio multiline">
        {resume.bio || "Bio"}
      </p>

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
  );
};

export default ResumePreview;
