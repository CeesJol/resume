import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const Separator = ({ large }) => {
  const { editingResume } = useContext(UserContext);
  const getClassName = () => {
    return `separator ${large ? "separator--large" : ""}`;
  };
  return (
    <p
      className={getClassName()}
      style={{
        fontSize: editingResume.fontSize,
      }}
    >
      -
    </p>
  );
};

export default Separator;
