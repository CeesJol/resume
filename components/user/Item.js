import React from "react";

const Item = ({ item, handleClick }) => {
  const theItem = (
    <div className="item">
      <p>{item.title}</p>
    </div>
	);
	// Dashboard version
  if (item)
    return (
      <a onClick={(e) => handleClick(e, item)} key={item._id}>
        {theItem}
      </a>
		);
	// Live version
  return ({theItem});
};

export default Item;
