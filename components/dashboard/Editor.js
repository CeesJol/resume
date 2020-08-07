import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import Resume from "./Resume";

export default () => {
  const {
		editingResume,
		setEditingResume,
		setPreview
  } = useContext(UserContext);
  const handleGoBack = () => {
    setEditingResume(-1);
	};
	useEffect(() => {
		setPreview(false);
	})
  return (
    <>
      <div className="dashboard__item">
        <i>
          Editing <b>{editingResume.title}</b>
        </i>
        <p>Click on any item to edit it</p>
        <a onClick={handleGoBack}>Back to your resumes</a>
      </div>
      <Resume />
    </>
  );
};
