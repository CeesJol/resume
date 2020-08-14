import React from "react";
import { contactpickerOptions } from "../../lib/constants";

const Contactpicker = ({ val, fn }) => (
  <select name={val} id={val} value={val} onChange={fn}>
    <option value="">Other</option>
    {Object.keys(contactpickerOptions).map((key) => {
      return <option key={key} value={key}>{key}</option>;
    })}
  </select>
);

export default Contactpicker;