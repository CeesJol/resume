import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import ResumePreview from "./ResumePreview";

const Resumes = () => {
  const { getUser, setCreatingResume } = useContext(UserContext);
  const handleCreate = () => {
    setCreatingResume({});
  };
  const sortByPriority = (list) => {
    return list.sort((item1, item2) => {
      return item1.priority < item2.priority ? -1 : 1;
    });
  };
  const drawResumePreviews = () => {
    const data = getUser();
    // TODO update the few lines below
    if (!data || !data.resumes) return <p>Loading...</p>;
    if (data === -1) return <p>Failed to load</p>;

    const resumes = data.resumes.data;

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
      <Button text="Create a resume" fn={handleCreate} />
    </div>
  );
};

export default Resumes;
