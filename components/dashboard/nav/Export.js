import React, { useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/userContext";
import ResumeWrapper from "../ResumeWrapper";
import Button from "../../general/Button";
import { isIOS } from "react-device-detect";
// import { PDF } from "../../../lib/api";

const Export = () => {
  const { setPreview, changingResume, pdf } = useContext(UserContext);
  const exportPDF = async () => {
    if (isIOS) {
      alert(
        "iOS does not support exporting to PDF. Please log in on your desktop and try it there."
      );
    } else {
      await pdf.save();
    }
    // await PDF({
    //   type: "EXPORT_PDF",
    //   html: '<h1 style="color: blue;">Hi there!2</h1>',
    // }).then(
    //   () => {
    //     console.info("success");
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );
  };
  useEffect(() => {
    setPreview(true);
  }, []);
  return !changingResume ? (
    <p>Select a resume to preview it</p>
  ) : (
    <>
      <div className="dashboard__item">
        <h4 className="dashboard__item--title">Export your resume</h4>
        <p>Preview and export your resume to PDF here.</p>
        <Button fn={exportPDF} text="Export" altText="Exporting..." />
      </div>
      {/* Resume preview */}
      <ResumeWrapper exportpdf={false} />

      {/* Resume export item */}
      <ResumeWrapper exportpdf={true} noscale={true} hidden={true} />

      {/* <ResumeWrapper exportpdf={true} noscale={true} /> */}
    </>
  );
};

export default Export;
