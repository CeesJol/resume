import React from "react";
import { VALUE_DESCRIPTIONS } from "../../../lib/constants";

const Valuepicker = ({ val, fn, name }) => (
  <select name={name} id={val} value={val} onChange={fn}>
    {VALUE_DESCRIPTIONS.map((v) => {
      return (
        <option key={v.value} value={v.value}>
          {`${v.value} (${v.description})`}
        </option>
      );
    })}
  </select>
);

export default Valuepicker;
