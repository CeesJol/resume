import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import NewItem from "./NewItem";
import { GET_DUMMY_ITEM } from "../../lib/constants";

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
        {getItems(category) && getItems(category).length > 0 ? (
          <>
            {!preview && (
              <p
                className="resume--hoverable"
                onClick={() => handleNewItem(category)}
              >
                <i>Add {category.name.toLowerCase()}</i>
              </p>
            )}
            {sortByPriority(getItems(category)).map((item, index) => (
              <div key={item._id}>
                <NewItem category={category} item={item} index={index} />
              </div>
            ))}
          </>
        ) : (
          <NewItem
            item={GET_DUMMY_ITEM(category.name)}
            category={category}
            dummy={true}
          />
        )}
      </div>
    </div>
  );
};

export default Category;
