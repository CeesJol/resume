import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import ResumePreview from "./ResumePreview";
import { MAX_NUMBER_OF_RESUMES } from "../../lib/constants";
import { sortByPriority } from "../../lib/util";

/**
 * List of resume previews on the main page of the dashboard.
 * Functionality:
 * - Sorts the resumes by priority and draws a preview for each one
 * - Allows resume creation, if user has less than MAX_NUMBER_OF_RESUMES resumes.
 */
const Resumes = () => {
  const { setCreatingResume, resumes, setPreview } = useContext(UserContext);
  const handleCreate = () => {
    setPreview(true);
    setCreatingResume({});
  };
  const drawResumePreviews = () => {
    if (resumes.length === 0) {
      return <p>Get started by creating a resume.</p>;
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
      {resumes.length < MAX_NUMBER_OF_RESUMES ? (
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
