import React, { useState } from "react";

import { PDFExport } from "@progress/kendo-react-pdf";

// class Pdf extends React.Component {
const Pdf = () => {
  const [resume, setResume] = useState(null);
  const exportPDF = () => {
    resume.save();
  };
  return (
    <>
      <PDFExport
        paperSize={"Letter"}
        fileName="_____.pdf"
        title=""
        subject=""
        keywords=""
        ref={(r) => (setResume(r))}
      >
        <div
          style={{
            height: 792,
            width: 612,
            padding: "none",
            backgroundColor: "white",
            boxShadow: "5px 5px 5px black",
            margin: "auto",
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          <p>content</p>
          {/* <i className={`fa fa-rocket`}></i> */}
        </div>
      </PDFExport>
      <button onClick={exportPDF}>download</button>
    </>
  );
};

export default Pdf;
