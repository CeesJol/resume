import Resume from "./Resume";

const ResumeWrapper = () => (
  <div
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <div className="dashboard__resume-wrapper">
      <Resume />
    </div>
  </div>
);

export default ResumeWrapper;
