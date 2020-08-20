import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { GET_CATEGORY_ITEMS } from "../../lib/constants";

const NewItem = ({ item, index }) => {
  const {
    setEditingItem,
    moveItem,
    forceRender,
    preview,
    getCategory,
  } = useContext(UserContext);
  const category_items = GET_CATEGORY_ITEMS(
    getCategory(item.category._id).type
  );
  const handleClick = (e, item) => {
    e.preventDefault();
    if (preview) return false;
    setEditingItem(item);
  };
  const handleMove = (e, item, amount) => {
    e.stopPropagation();
    if (preview) return false;
    moveItem(item, amount);
    forceRender();
  };
  return (
    <>
      {index > 0 && !preview && (
        <p className="resume--hoverable">
          <i
            onClick={(e) => handleMove(e, item, -1)}
            style={{ cursor: "pointer" }}
          >
            Move up
          </i>
        </p>
      )}
      <div
        className={`resume__item ${!preview ? "resume--hoverable" : ""}`}
        onClick={(e) => handleClick(e, item)}
        key={item._id}
      >
        <h3 className="resume__item--title">{item.title}</h3>
        <h3 className="resume__item--location">{item.location}</h3>
        {item.year1 && (
          <p className="resume__item--date">
            {item.month1 ? item.month1 + "/" : ""}
            {item.year1}
            {item.year2 &&
              " - " + (item.month2 ? item.month2 + "/" : "") + item.year2}
            {!item.year2 && category_items.includes("year2") && " - Present"}
          </p>
        )}
        {item.value && item.value}
        {item.description && (
          <p className="resume__item--description multiline">
            {item.description}
          </p>
        )}
      </div>
    </>
  );
};

export default NewItem;
