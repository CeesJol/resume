import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export default () => {
  const { getUser } = useContext(UserContext);
  return (
    getUser() &&
    (getUser().confirmed ? (
      <div className="dashboard__live">
        View{" "}
        <a href={getUser().username} target="_blank">
          your resume
        </a>{" "}
        live
      </div>
    ) : (
      <div className="dashboard__confirm">
        Confirm your email address to export your resume
      </div>
    ))
  );
};
