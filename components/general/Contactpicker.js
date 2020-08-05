import React from "react";
import { contactpickerOptions } from "../../lib/constants";

export default ({ val, fn }) => (
  <select name={val} id={val} value={val} onChange={fn}>
    <option value="">Other</option>
    {Object.keys(contactpickerOptions).map((key) => {
      return <option value={key}>{key}</option>;
    })}
  </select>
);
