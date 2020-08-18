import React from "react";
import { defaultCategories } from "../../lib/constants";

const Categorypicker = ({ val, fn }) => (
  <select name={val} id={val} value={val} onChange={fn}>
    {defaultCategories.map((cat) => {
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
