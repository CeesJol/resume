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
		preview
  } = useContext(UserContext);
  const handleClick = (e, category) => {
		e.preventDefault();
		if (preview) return false;
    setEditingCategory(category);
  };
  const handleNewItem = (category) => {
		if (preview) return false;
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
		if (preview) return false;
    moveCategory(category, amount);
    forceRender();
  };
  return (
    <div className="resume__category">
      {index > 0 && !preview && (
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
        <h3 className={`resume__category--name ${!preview ? "resume--hoverable" : ""}`}>{category.name}</h3>
        {!preview && <a onClick={() => handleNewItem(category)}>
          <i>Add item</i>
        </a>}
        {category.items && category.items.data.length > 0 ? (
          sortByPriority(category.items.data).map((item, index) => (
            <div key={item._id}>
              <NewItem item={item} index={index} />
            </div>
          ))
        ) : (
					<>
						<DummyItem category={category} />
					</>
        )}
      </div>
    </div>
  );
};

export default Category;
