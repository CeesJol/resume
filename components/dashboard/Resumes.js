import React, { useContext } from "react";
import Item from "../user/Item";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";

export default (props) => {
  const {
    getUser,
    setEditingItem,
    setEditingResume,
    creatingResume,
    setCreatingResume,
  } = useContext(UserContext);
  const handleClick = (e, resume) => {
    e.preventDefault();
    setEditingResume(resume);
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
      return (
        <>
          <p>Click on a resume to edit it</p>
          {resumes.map((resume, i) => (
            <div key={resume._id}>
              <h2 onClick={(e) => handleClick(e, resume)}>{resume.title}</h2>
            </div>
          ))}
        </>
      );
    return <p>Get started by creating your resume</p>;
  };

  return (
    <div className="dashboard__item">
      <h4>Your resumes</h4>
      <div id="items-container">{drawItems()}</div>
      <Button text="Create a resume" fn={handleCreate} />
    </div>
  );
};
