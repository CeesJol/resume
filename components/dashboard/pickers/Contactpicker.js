import React, { useContext } from "react";
import { UserContext } from "../../../contexts/userContext";

const Contactpicker = ({ val, fn }) => {
  const { getUnusedContactOptions } = useContext(UserContext);
  return (
    <select name={val} id={val} value={val} onChange={fn}>
      {getUnusedContactOptions().map((key) => {
        // Remove default icon
        if (key !== "")
          return (
            <option key={`contactpicker-${key}`} value={key}>
              {key}
            </option>
          );
      })}
      <option value="">Other</option>
    </select>
  );
};

export default Contactpicker;
