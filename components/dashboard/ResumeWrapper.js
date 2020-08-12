import Resume from "./Resume";

const ResumeWrapper = ({ noscale }) => (
  <div
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <div className={"dashboard__resume-wrapper " + (noscale ? "dashboard__resume-wrapper--noscale" : "")}>
      <Resume />
    </div>
  </div>
);

export default ResumeWrapper;
