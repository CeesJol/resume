import React from "react";

const Yearpicker = ({ val, name, fn }) => {
  const items = [
    <option key={`yearpicker-${val}-${0}`} value="">
      Year
    </option>,
  ];
  let currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 1960; i--) {
    items.push(
      <option value={i} key={`yearpicker-${val}-${i}`}>
        {i}
      </option>
    );
  }
  return (
    <select
      className="select-narrow"
      name={name}
      id={val}
      value={val}
      onChange={fn}
    >
      {items}
    </select>
  );
};

export default Yearpicker;
