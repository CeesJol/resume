import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import { GET_DUMMY_ITEM } from "../../lib/constants";

const DummyItem = ({ category }) => {
  const { setEditingItem, preview } = useContext(UserContext);
  const handleClick = (e) => {
    e.preventDefault();
    if (preview) return false;
    setEditingItem({
      category,
    });
  };
  const [item, setItem] = useState(null);
  useEffect(() => {
    if (!item) setItem(GET_DUMMY_ITEM(category.name));
  });
  return item ? (
    <div
      className={`resume__item ${!preview ? "resume--hoverable" : ""}`}
      onClick={(e) => handleClick(e)}
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
  ) : (
    <></>
  );
};

export default DummyItem;
