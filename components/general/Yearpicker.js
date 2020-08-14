import React from "react";

const Yearpicker = ({ val, fn }) => {
  const items = [<option value="" key={`${val}`}>Year</option>];
  var currentYear = new Date().getFullYear();
  for (var i = currentYear; i >= 1960; i--) {
    items.push(<option value={i} key={`${val}-${i}`}>{i}</option>)
  }
  return (
    <>
      <select
        className="select-narrow"
        name={val}
        id={val}
        value={val}
        onChange={fn}
      >
        {items}
      </select>
    </>
  );
};

export default Yearpicker;
