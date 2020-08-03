import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const NewItem = ({ item, index }) => {
  const { setEditingItem, editingResume, moveItem, forceRender } = useContext(
    UserContext
  );
  const handleClick = (e, item) => {
    e.preventDefault();
    setEditingItem(item);
  };
  const handleMove = (item, amount) => {
    moveItem(item, amount);
    forceRender();
  };
  return (
    <>
      {index > 0 && (
        <a>
          <i onClick={() => handleMove(item, -1)} style={{ cursor: "pointer" }}>
            Move up
          </i>
        </a>
      )}
      <div
        className="resume__item"
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
