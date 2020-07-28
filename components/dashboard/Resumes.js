import React, { useContext } from "react";
import Item from "../user/Item";
import { DashboardContext } from "../../contexts/dashboardContext";
import { UserContext } from "../../contexts/userContext";

export default (props) => {
  const { setEditingItem, setEditingResume } = useContext(DashboardContext);
  const { getUser } = useContext(UserContext);
  function handleClick(e, resume) {
    e.preventDefault();
    console.log('resume', resume);
    setEditingResume(resume._id);
  }
  function drawItems() {
    const data = getUser();
    // TODO update the few lines below
    if (!data || !data.resumes) return <p>Loading...</p>;
    if (data === -1) return <p>Failed to load</p>;

    const resumes = data.resumes.data;

    if (resumes.length > 0)
      return (
        <>
          <p>Click on a resume to edit it</p>
          {resumes.map((resume, i) => (
            <div key={resume._id}>
              <a onClick={(e) => handleClick(e, resume)}>
                <h2>{resume.title}</h2>
              </a>
            </div>
          ))}
        </>
      );
    return <p>Get started by creating your resume</p>;
  }

  return (
    <div className="dashboard__items">
      <h4>Your resumes</h4>
      <div id="items-container">{drawItems()}</div>
    </div>
  );
};
