import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const TopBox = () => {
  const { user, userExists } = useContext(UserContext);
  return (
    userExists() &&
    (user.confirmed ? (
      <div className="dashboard__item dashboard__item--green">
        View{" "}
        <a href={user.username} target="_blank">
          your resume
        </a>{" "}
        live
      </div>
    ) : (
      <div className="dashboard__item dashboard__item--green">
        Confirm your email address to export your resume
      </div>
    ))
  );
};

export default TopBox;
