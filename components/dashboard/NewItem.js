import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const NewItem = ({ item, index }) => {
  const {
    setEditingItem,
    editingResume,
    moveItem,
    forceRender,
    preview,
  } = useContext(UserContext);
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
        <p className="resume__item--date">
          {item.from} - {item.to}
        </p>
        <p className="resume__item--description multiline">
          {item.description}
        </p>
      </div>
    </>
  );
};

export default NewItem;
