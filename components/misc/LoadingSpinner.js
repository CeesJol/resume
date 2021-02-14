import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const LoadingSpinner = () => {
  const { status } = useContext(UserContext);
  return (
    <div
      class="lds-dual-ring"
      style={{ visibility: status.endsWith("...") ? "visible" : "hidden" }}
    ></div>
  );
};

export default LoadingSpinner;
