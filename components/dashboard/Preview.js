import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import ResumeWrapper from "./ResumeWrapper";

const Preview = () => {
  const { setPreview, editingResume } = useContext(UserContext);
  useEffect(() => {
    setPreview(true);
  }, []);
  return editingResume === -1 ? (
    <p>Select a resume to preview it</p>
  ) : (
    <ResumeWrapper />
  );
};

export default Preview;
