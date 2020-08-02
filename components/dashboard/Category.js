import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import NewItem from "./NewItem";

const Category = ({ category }) => {
  const { setEditingCategory, setEditingItem } = useContext(UserContext);
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
  return (
    <div onClick={(e) => handleClick(e, category)}>
      <h2>{category.name}</h2>
      <a onClick={() => handleNewItem(category)}>
        <i>Add item</i>
      </a>
      {sortByPriority(category.items.data).map((item) => (
        <div className="resume__item" key={item._id}>
          <NewItem item={item} />
          <br />
        </div>
      ))}
    </div>
  );
};

export default Category;
