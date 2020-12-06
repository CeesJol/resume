import React, { useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/userContext";
import ResumeWrapper from "../ResumeWrapper";
import { fauna } from "../../../lib/api";
import Button from "../../general/Button";
import { toast } from "react-toastify";

const Editor = () => {
  const { editingResume, setChangingResume, setPreview } = useContext(
    UserContext
  );
  const handleGoBack = () => {
    setChangingResume(false);
    setPreview(true);
  };
  const handleSave = async () => {
    const myData = editingResume;
    await fauna({
      type: "UPDATE_RESUME",
      id: editingResume._id,
      data: myData,
    }).then(
      (data) => {
        console.log("data:", data);
        toast.success("yey");
      },
      (err) => {
        console.log("err:", err);
        toast.error("ney");
      }
    );
  };
  useEffect(() => {
    setPreview(false);
  });
  return (
    <>
      <div className="dashboard__item">
        <h4 className="dashboard__item--title">{editingResume.title}</h4>
        <Button text="Save now" altText="Saving..." fn={handleSave}>
          Save now
        </Button>
        <br />
        <a onClick={handleGoBack}>All resumes</a>
      </div>
      <ResumeWrapper exportpdf={false} />
    </>
  );
};

export default Editor;
