import React from "react";
import { CONTACTPICKER_OPTIONS } from "../../../lib/constants";

const Contactpicker = ({ val, fn }) => (
  <select name={val} id={val} value={val} onChange={fn}>
    {Object.keys(CONTACTPICKER_OPTIONS).map((key) => {
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

export default Contactpicker;
