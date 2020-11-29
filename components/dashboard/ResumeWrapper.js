import Resume from "./Resume";

/**
 * Wrapper for the resume, used when displaying the resume in full size.
 * Functionality:
 * - Centers the resume
 * - Hides the resume when it will be used to export
 * - Disables scaling when it will be used to export
 * Styling:
 * - Adds a shadow
 * - Scales the resume to fit the screen
 * - Adds a small margin
 */
const ResumeWrapper = ({ noscale, exportpdf, hidden }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        className={`dashboard__resume-wrapper ${
          noscale ? "dashboard__resume-wrapper--noscale" : ""
        }`}
        style={
          hidden
            ? { position: "absolute", left: "-10000px", top: "-10000px" }
            : {}
        }
      >
        <Resume exportpdf={exportpdf} />
      </div>
    </div>
  );
};

export default ResumeWrapper;
