import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const NewItem = ({ item }) => {
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
	}
  return (
    <>
      <a>
        <i
          onClick={() => handleMove(item, -1)}
          style={{ cursor: "pointer" }}
        >
          Move up
        </i>
      </a>
      <a onClick={(e) => handleClick(e, item)} key={item._id}>
        <div className="item">
          <h3>
            <b>{item.title}</b>
          </h3>
          <h3>{item.location}</h3>
          <i>
            {item.from} - {item.to}
          </i>
          <p className="multiline">{item.description}</p>
        </div>
      </a>
    </>
  );
};

export default NewItem;
