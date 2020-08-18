import React from "react";
import { DEFAULT_CATEGORIES } from "../../lib/constants";

const Categorypicker = ({ val, fn }) => (
  <select name={val} id={val} value={val} onChange={fn}>
    {DEFAULT_CATEGORIES.map((cat) => {
      return (
        <option key={cat} value={cat}>
          {cat}
        </option>
      );
    })}
    <option value="Other">Other</option>
  </select>
);

export default Categorypicker;
