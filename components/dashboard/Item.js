import React, { useContext } from "react";
import Item from "../user/Item";
import { DashboardContext } from "../../contexts/dashboardContext";

export default (props) => {
  const { editingItem, data, error } = useContext(DashboardContext);
  function drawItem(drawItem) {
    if (!data) return <p>Loading...</p>;
    if (error || data === -1) return <p>Failed to load</p>;
    if (!data.userByEmail) return <p>404 - user not found</p>;

    const items = data.userByEmail.items.data;

    if (items.length > 0) {
      // TODO does find work for SEO does it even matter and stuff or am i just bitching
      const item = items.find(
        (item) => item._id == drawItem._id
      );
      if (!item) return <p>Something went wrong</p>;

      return (
        <Item
          imageUrl={item.imageUrl}
          itemUrl={item.itemUrl}
          item={item}
          handleClick={() => {}}
        />
      );
    }
    return <p>Add a item to get started with your store</p>;
  }

  return (
    <div className="dashboard__preview">
      <h4>Preview</h4>
      <p>Preview of the item</p>
      {drawItem(editingItem)}
    </div>
  );
};
