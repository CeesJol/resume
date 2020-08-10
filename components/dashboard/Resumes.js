import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";

const Resumes = () => {
  const { getUser, setEditingResume, setCreatingResume, setChangingResume } = useContext(
    UserContext
  );
  const handleClick = (e, resume) => {
    e.preventDefault();
		setEditingResume(resume);
		setChangingResume(true);
  };
  const handleCreate = () => {
    setCreatingResume({});
  };
  const drawItems = () => {
    const data = getUser();
    // TODO update the few lines below
    if (!data || !data.resumes) return <p>Loading...</p>;
    if (data === -1) return <p>Failed to load</p>;

    const resumes = data.resumes.data;

    if (resumes.length > 0)
      return resumes.map((resume, i) => (
        <div
          className="dashboard__resume-preview resume--hoverable"
          key={resume._id}
          onClick={(e) => handleClick(e, resume)}
        >
          <h3 className="dashboard__resume-preview--title">{resume.title}</h3>
          <h3 className="dashboard__resume-preview--job-title">
            {resume.jobTitle}
          </h3>
          <p className="dashboard__resume-preview--bio multiline">
            {resume.bio}
          </p>
        </div>
      ));
    return <p>Get started by creating your resume</p>;
  };

  return (
    <div className="dashboard__item">
      <h4>Your resumes</h4>
      {drawItems()}
      <Button text="Create a resume" fn={handleCreate} />
    </div>
  );
};

export default Resumes;
