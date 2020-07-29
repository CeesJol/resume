import React, { useContext, useState } from "react";
import { DashboardContext } from "../../contexts/dashboardContext";

const NewItem = ({ item }) => {
  const { setEditingItem, editingResume, handleMove } = useContext(DashboardContext);
  const handleClick = (e, item) => {
    e.preventDefault();
    console.log("item", item);
    setEditingItem(item);
  };
  return (
    <>
      <a><i onClick={() => handleMove(-1)} style={{cursor: "pointer"}}>Move up</i></a>
      <a onClick={(e) => handleClick(e, item)} key={item._id}>
        <div className="item">
          <h3>
            <b>{item.title}</b>
          </h3>
          <h3>{item.location}</h3>
          <i>
            {item.from} - {item.to}
          </i>
          <p className="multiline">{item.description}</p>
        </div>
      </a>
    </>
  );
};

export default NewItem;
