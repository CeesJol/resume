import React from "react";

const Item = ({ item, handleClick }) => {
  const theItem = (
    <div className="item">
      <h3>{item.title}</h3>
      <i>{item.location}</i>
      <p>{item.from} - {item.to}</p>
      <p>{item.description}</p>
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
