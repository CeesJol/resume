import React, { useContext }from "react";
import Item from "../user/Item";
import { DashboardContext } from "../../contexts/dashboardContext";

export default (props) => {
	const { data, error, setEditingItem } = useContext(DashboardContext);
	function handleClick(e, item) {
    e.preventDefault();
    setEditingItem(item);
  }
  function drawItems() {
    if (!data) return <p>Loading...</p>;
    if (error || data === -1) return <p>Failed to load</p>;
    if (!data.userByEmail) return <p>404 - user not found</p>;

    const items = data.userByEmail.items.data;

    if (items.length > 0)
      return (
        <>
          <p>Click on any item to edit it</p>
          {items.map((item, i) => (
            <Item
              key={i}
              item={item}
              handleClick={handleClick}
            />
          ))}
        </>
      );
    return <p>Get started by creating your resume</p>;
  }

  return (
    <div className="dashboard__items">
      <h4>Your resume</h4>
      <div id="items-container">{drawItems()}</div>
    </div>
  );
};
