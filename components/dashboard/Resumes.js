import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import ResumePreview from "./ResumePreview";
import { MAX_NUMBER_OF_RESUMES } from "../../lib/constants";

const Resumes = () => {
  const { setCreatingResume, getResumes, setPreview } = useContext(UserContext);
  const handleCreate = () => {
    setPreview(true);
    setCreatingResume({});
  };
  const sortByPriority = (list) => {
    return list.sort((item1, item2) => {
      return item1.priority < item2.priority ? -1 : 1;
    });
  };
  const drawResumePreviews = () => {
    const resumes = getResumes();

    if (resumes.length > 0) {
      return sortByPriority(resumes).map((resume, index) => (
        <ResumePreview resume={resume} key={resume._id} index={index} />
      ));
    }
    return <p>Get started by creating your resume</p>;
  };

  return (
    <div className="dashboard__item">
      <h4>Your resumes</h4>
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
