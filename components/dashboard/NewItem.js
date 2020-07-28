import React, { useContext } from "react";
import { DashboardContext } from "../../contexts/dashboardContext";

const NewItem = ({ item, handleClick }) => {
	const { setEditingItem, editingResume } = useContext(DashboardContext);
	function handleClick(e, item) {
    e.preventDefault();
    console.log('item', item);
    setEditingItem(item);
  }
  return (
    <a onClick={(e) => handleClick(e, item)} key={item._id}>
      <div className="item">
        <h3><b>{item.title}</b></h3>
        <h3>{item.location}</h3>
        <i>
          {item.from} - {item.to}
        </i>
        <p className="multiline">{item.description}</p>
      </div>
    </a>
  );
};

export default NewItem;
