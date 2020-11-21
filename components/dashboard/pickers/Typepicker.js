import React from "react";
import { CATEGORY_TYPES } from "../../../lib/constants";

const Typepicker = ({ val, fn }) => (
  <select name={val} id={val} value={val} onChange={fn}>
    {CATEGORY_TYPES.map((cat) => {
      return (
        <option key={`cat-${cat}`} value={cat}>
          {cat}
        </option>
      );
    })}
  </select>
);

export default Typepicker;
