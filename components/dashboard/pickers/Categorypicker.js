import React, { useContext } from "react";
import { UserContext } from "../../../contexts/userContext";

const Categorypicker = ({ val, fn }) => {
  const { getUnusedCategories } = useContext(UserContext);
  return (
    <select name={val} id={val} value={val} onChange={fn}>
      {getUnusedCategories().map((cat) => {
        return (
          <option key={`categorypicker-${cat.title}`} value={cat.title}>
            {cat.title}
          </option>
        );
      })}
    </select>
  );
};

export default Categorypicker;
