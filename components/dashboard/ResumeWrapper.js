import Resume from "./Resume";

const ResumeWrapper = ({ noscale, exportpdf }) => {
  return noscale ? (
    <div style={{ position: "absolute", left: "-10000px", top: "0" }}>
      <div
        className={
          "dashboard__resume-wrapper dashboard__resume-wrapper--noscale"
        }
      >
        <Resume exportpdf={exportpdf} />
      </div>
    </div>
  ) : (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className={"dashboard__resume-wrapper "}>
        <Resume exportpdf={exportpdf} />
      </div>
    </div>
  );
};

export default ResumeWrapper;
