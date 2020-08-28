import Resume from "./Resume";

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
