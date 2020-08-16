import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import ResumeWrapper from "./ResumeWrapper";

const Editor = () => {
  const { editingResume, setChangingResume, setPreview } = useContext(
    UserContext
  );
  const handleGoBack = () => {
		setChangingResume(false);
		setPreview(true);
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
      <ResumeWrapper exportpdf={false} />
    </>
  );
};

export default Editor;
