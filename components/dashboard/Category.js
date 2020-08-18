import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import NewItem from "./NewItem";
import DummyItem from "./DummyItem";

const Category = ({ category, index }) => {
  const {
    setEditingCategory,
    setEditingItem,
    moveCategory,
    forceRender,
    preview,
    getLayoutItem,
    getItems,
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
        <p className="resume--hoverable">
          <i
            onClick={() => handleMove(category, -1)}
            style={{ cursor: "pointer" }}
          >
            Move up
          </i>
        </p>
      )}
      <div onClick={(e) => handleClick(e, category)}>
        <h3
          className={`resume__category--name ${
            !preview ? "resume--hoverable" : ""
          }`}
          style={{
            color: getLayoutItem("Primary Color"),
          }}
        >
          {category.name}
        </h3>
        {!preview && (
          <p
            className="resume--hoverable"
            onClick={() => handleNewItem(category)}
          >
            <i>Add item</i>
          </p>
        )}
        {getItems(category) && getItems(category).length > 0 ? (
          sortByPriority(getItems(category)).map((item, index) => (
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
