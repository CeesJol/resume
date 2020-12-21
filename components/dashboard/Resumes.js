import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import ResumePreview from "./ResumePreview";
import { MAX_NUMBER_OF_RESUMES, sortByPriority } from "../../lib/constants";

/**
 * List of resume previews on the main page of the dashboard.
 * Functionality:
 * - Sorts the resumes by priority and draws a preview for each one
 * - Allows resume creation, if user has less than MAX_NUMBER_OF_RESUMES resumes.
 */
const Resumes = () => {
  const { setCreatingResume, getResumes, setPreview } = useContext(UserContext);
  const handleCreate = () => {
    setPreview(true);
    setCreatingResume({});
  };
  const drawResumePreviews = () => {
    const resumes = getResumes();

    if (resumes.length === 0) {
      return <p>Get started by creating your resume</p>;
    }
    return sortByPriority(resumes).map((resume, index) => (
      <ResumePreview
        resume={resume}
        key={`resume-${resume._id}`}
        index={index}
      />
    ));
  };

  return (
    <div className="dashboard__item">
      <h4 className="dashboard__item--title">Your resumes</h4>
      {drawResumePreviews()}
      {getResumes().length < MAX_NUMBER_OF_RESUMES ? (
        <Button text="Create a resume" fn={handleCreate} />
      ) : (
        <p>
          You have reached the maximum number of resumes (
          {MAX_NUMBER_OF_RESUMES}). Delete a resume to create a new one.
        </p>
      )}
    </div>
  );
};

export default Resumes;
