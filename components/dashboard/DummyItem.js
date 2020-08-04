import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import { getDummyItem } from "../../lib/constants";

const DummyItem = ({ category }) => {
  const { setEditingItem } = useContext(UserContext);
  const handleClick = (e) => {
    e.preventDefault();
    setEditingItem({
      category,
    });
  };
  const [item, setItem] = useState(null);
  useEffect(() => {
    if (!item) setItem(getDummyItem(category.name.toLowerCase()));
  });
  return item ? (
    <div className="resume__item" onClick={(e) => handleClick(e)}>
      <h3 className="resume__item--title">{item.title}</h3>
      <h3 className="resume__item--location">{item.location}</h3>
      <p className="resume__item--date">
        {item.from} - {item.to}
      </p>
      <p className="resume__item--description multiline">{item.description}</p>
    </div>
  ) : (
    <></>
  );
};

export default DummyItem;
