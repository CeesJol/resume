import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { GET_CATEGORY_ITEMS } from "../../lib/constants";
import Button from "../general/Button";

const NewItem = ({ category, item, index, dummy, hovering }) => {
  const {
    setEditingItem,
    moveItem,
    forceRender,
    preview,
    getLayoutItem,
  } = useContext(UserContext);
  const categoryItems = GET_CATEGORY_ITEMS(category.type);
  const getTypeClassName = () => {
    return category.type.toLowerCase().replace(/\s/g, "-");
  };
  const handleClick = (e, item) => {
    e.preventDefault();
    if (preview) return false;
    if (dummy) setEditingItem({ category });
    else setEditingItem(item);
  };
  const handleMove = async (item, amount) => {
    if (preview || dummy) return false;
    await moveItem(item, amount);
    forceRender();
  };
  return (
    <div
      className={`resume__item resume__item--${getTypeClassName()} ${
        !preview ? "resume--hoverable" : ""
      }`}
      style={
        getTypeClassName() === "title-and-value"
          ? {
              backgroundColor: getLayoutItem("Primary Color"),
            }
          : {}
      }
      onClick={(e) => handleClick(e, item)}
      key={item._id}
    >
      <h3 className="resume__item--title">{item.title}</h3>
      {hovering &&
        index > 0 &&
        !preview &&
        !dummy &&
        getTypeClassName() !== "title-and-value" && (
          <span
            className="resume__actions"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              fn={() => handleMove(item, -1)}
              text="Move up"
              altText="Moving..."
              textual={true}
            />
          </span>
        )}
      <h3 className="resume__item--location">{item.location}</h3>
      {item.year1 && (
        <p className="resume__item--date">
          {item.month1 ? item.month1 + "/" : ""}
          {item.year1}
          {item.year2 &&
            " - " + (item.month2 ? item.month2 + "/" : "") + item.year2}
          {!item.year2 && categoryItems.includes("year2") && " - Present"}
        </p>
      )}
      {item.value && item.value}
      {item.description && (
        <p className="resume__item--description multiline">
          {item.description}
        </p>
      )}
    </div>
  );
};

export default NewItem;
