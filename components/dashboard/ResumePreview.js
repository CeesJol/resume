import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";

const ResumePreview = ({ resume }) => {
  const {
    getUser,
    setEditingResume,
    setCreatingResume,
    setChangingResume,
    setWarning,
  } = useContext(UserContext);
  const handleClick = (e, resume) => {
    e.preventDefault();
    setEditingResume(resume);
    setChangingResume(true);
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
    </div>
  );
};

export default ResumePreview;
