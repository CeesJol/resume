import React from "react";
import { CONTACTPICKER_OPTIONS } from "../../lib/constants";

const Contactpicker = ({ val, fn }) => (
  <select name={val} id={val} value={val} onChange={fn}>
    <option value="">Other</option>
    {Object.keys(CONTACTPICKER_OPTIONS).map((key) => {
      return (
        <option key={key} value={key}>
          {key}
        </option>
      );
    })}
  </select>
);

export default Contactpicker;
