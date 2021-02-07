import React from "react";
import { ALL_CATEGORIES } from "../../../lib/constants";

const Categorypicker = ({ val, fn }) => (
  <select name={val} id={val} value={val} onChange={fn}>
    {ALL_CATEGORIES.map((cat) => {
      return (
        <option key={`categorypicker-${cat.title}`} value={cat.title}>
          {cat.title}
        </option>
      );
    })}
    <option value="Other">Other... (custom type)</option>
  </select>
);

export default Categorypicker;
