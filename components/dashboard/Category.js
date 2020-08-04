import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import NewItem from "./NewItem";
import DummyItem from "./DummyItem";

const Category = ({ category, index }) => {
  const {
    setEditingCategory,
    setEditingItem,
    moveCategory,
    forceRender,
  } = useContext(UserContext);
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
      return item1.priority < item2.priority ? -1 : 1;
    });
  };
  const handleMove = (category, amount) => {
    moveCategory(category, amount);
    forceRender();
  };
  return (
    <div className="resume__category">
      {index > 0 && (
        <a>
          <i
            onClick={() => handleMove(category, -1)}
            style={{ cursor: "pointer" }}
          >
            Move up
          </i>
        </a>
      )}
      <div onClick={(e) => handleClick(e, category)}>
        <h3 className="resume__category--name">{category.name}</h3>
        <a onClick={() => handleNewItem(category)}>
          <i>Add item</i>
        </a>
        {category.items && category.items.data.length > 0 ? (
          sortByPriority(category.items.data).map((item, index) => (
            <div key={item._id}>
              <NewItem item={item} index={index} />
              <br />
            </div>
          ))
        ) : (
					<>
						<DummyItem category={category} />
						<br />
					</>
        )}
      </div>
    </div>
  );
};

export default Category;
