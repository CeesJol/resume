import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import ResumeWrapper from "./ResumeWrapper";

const Editor = () => {
  const { editingResume, setEditingResume, setPreview } = useContext(
    UserContext
  );
  const handleGoBack = () => {
    setEditingResume(-1);
  };
  useEffect(() => {
    setPreview(false);
  });
  return (
    <>
      <div className="dashboard__item">
        <h4>{editingResume.title}</h4>
        <a onClick={handleGoBack}>All resumes</a>
      </div>
      <ResumeWrapper />
    </>
  );
};

export default Editor;
