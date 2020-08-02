import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export default () => {
  const { getUser } = useContext(UserContext);
  return (
    <div className="dashboard__item">
      <h4>Layout</h4>
      <div></div>
    </div>
  );
};
