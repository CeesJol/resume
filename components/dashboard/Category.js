import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import NewItem from "./NewItem";

const Category = ({ category, index }) => {
  const { setEditingCategory, setEditingItem, moveCategory, forceRender } = useContext(UserContext);
  const handleClick = (e, category) => {
    e.preventDefault();
		setEditingCategory(category);
	};
	const handleNewItem = (category) => {
    setEditingItem({
      category,
    });
	};
	const sortByPriority = (list) => {
		return list.sort((item1, item2) => {
			return (item1.priority < item2.priority) ? -1 : 1
		})
	}
	const handleMove = (category, amount) => {
    moveCategory(category, amount);
    forceRender();
  };
  return (
		<>
		{index > 0 && (
        <a>
          <i onClick={() => handleMove(category, -1)} style={{ cursor: "pointer" }}>
            Move up
          </i>
        </a>
      )}
    <div onClick={(e) => handleClick(e, category)}>
      <h2>{category.name}</h2>
      <a onClick={() => handleNewItem(category)}>
        <i>Add item</i>
      </a>
      {sortByPriority(category.items.data).map((item, index) => (
        <div className="resume__item" key={item._id}>
          <NewItem item={item} index={index} />
          <br />
        </div>
      ))}
    </div>
		</>
  );
};

export default Category;
