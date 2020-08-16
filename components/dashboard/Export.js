import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import ResumeWrapper from "./ResumeWrapper";
import Button from "../general/Button";

const Export = () => {
  const { setPreview, changingResume, pdf } = useContext(UserContext);
  const exportPDF = async () => {
    await pdf.save();
  };
  useEffect(() => {
    setPreview(true);
  }, []);
  return changingResume === -1 ? (
    <p>Select a resume to preview it</p>
  ) : (
    <>
      <div className="dashboard__item">
        <h4>Export your resume</h4>
        <p>
          Preview and export your resume to PDF here.
        </p>
        <Button fn={exportPDF} text="Export" altText="Exporting..." />
      </div>
			{/* Resume preview */}
			<ResumeWrapper exportpdf={false} />

			{/* Resume export item */}
      <ResumeWrapper exportpdf={true} noscale={true} />
    </>
  );
};

export default Export;
