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
  const getWrapperClassName = () => {
    let className = "dashboard__resume-wrapper";
    if (noscale) {
      className += " dashboard__resume-wrapper--noscale";
    }
    return className;
  };
  const getWrapperStyle = () => {
    // Hide the resume, used to export a version without scaling
    // While showing a version that is scaled that won't be exported
    if (hidden)
      return { position: "absolute", left: "-10000px", top: "-10000px" };
    return {};
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className={getWrapperClassName()} style={getWrapperStyle()}>
        <Resume exportpdf={exportpdf} />
      </div>
    </div>
  );
};

export default ResumeWrapper;
