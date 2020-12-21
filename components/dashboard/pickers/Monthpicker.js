import React from "react";

const Monthpicker = ({ val, name, fn }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const getValue = (index) => {
    const value = (index + 1).toString();
    // Append a 0 before each single digit index month
    if (index < 10) return "0" + value;
    return value;
  };
  return (
    <select
      className="select-narrow"
      name={name}
      id={val}
      value={val}
      onChange={fn}
    >
      <option value="">Month</option>
      {months.map((month, index) => (
        <option value={getValue(index)} key={`month-${index}`}>
          {month}
        </option>
      ))}
    </select>
  );
};

export default Monthpicker;
