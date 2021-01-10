import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const Separator = ({ large }) => {
  const { editingResume } = useContext(UserContext);
  return (
    <span
      className="separator"
      style={{
        fontSize: large ? "16px" : editingResume.fontSize,
      }}
    >
      -
    </span>
  );
};

export default Separator;
