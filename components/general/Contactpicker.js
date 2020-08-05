import React from "react";

export default ({ val, fn }) => (
  <>
    <select
      name={val}
      id={val}
      value={val}
      onChange={fn}
    >
      <option value="">Other</option>
      <option value="LinkedIn">LinkedIn</option>
      <option value="Github">Github</option>
    </select>
  </>
);
