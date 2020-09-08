import React from "react";
import { ALL_CATEGORIES } from "../../../lib/constants";

const Categorypicker = ({ val, fn }) => (
  <select name={val} id={val} value={val} onChange={fn}>
    {ALL_CATEGORIES.map((cat) => {
      return (
        <option key={cat.name} value={cat.name}>
          {cat.name}
        </option>
      );
    })}
    <option value="Other">Other...</option>
  </select>
);

export default Categorypicker;