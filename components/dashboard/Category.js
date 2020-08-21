import React, { useContext, useState } from "react";
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
  const [isShown, setIsShown] = useState(false);
  const getTypeClassName = () => {
    return category.type.toLowerCase().replace(/\s/g, "-");
  };
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
    <div
      className={`resume__category ${
        !preview ? "resume__category--hoverable" : ""
      } resume__category--${getTypeClassName()}`}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <div>
        <h3
          className={`resume__category--name ${
            !preview ? "resume--hoverable" : ""
          }`}
          onClick={(e) => handleClick(e, category)}
          style={{
            color: getLayoutItem("Primary Color"),
          }}
        >
          {category.name}
        </h3>
        {isShown && !preview && (
          <p
            className="resume--hoverable resume--action"
            onClick={() => handleNewItem(category)}
          >
            <i>Add {category.name.toLowerCase()}</i>
          </p>
        )}
        {isShown && index > 0 && !preview && (
          <>
            <i> - </i>
            <p className="resume--hoverable resume--action">
              <i
                onClick={() => handleMove(category, -1)}
                style={{ cursor: "pointer" }}
              >
                Move up
              </i>
            </p>
          </>
        )}
        {getItems(category) && getItems(category).length > 0 ? (
          <div className="resume__category--items-container">
            {sortByPriority(getItems(category)).map((item, index) => (
              <NewItem
                category={category}
                item={item}
                index={index}
                key={item._id}
              />
            ))}
          </div>
        ) : (
          <div className="resume__category--items-container">
            <NewItem
              category={category}
              item={GET_DUMMY_ITEM(category.name)}
              index={0}
              dummy={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
