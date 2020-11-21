import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import Item from "./Item";
import { getDummyItem, sortByPriority } from "../../lib/constants";
import Button from "../general/Button";
import Separator from "./Separator";
import { isMobile } from "react-device-detect";

const Category = ({ category, index, primaryColor, backgroundColor }) => {
  const {
    setEditingCategory,
    setEditingItem,
    moveCategory,
    forceRender,
    preview,
    editingResume,
    getItems,
    getCategories,
  } = useContext(UserContext);
  const [hovering, setHovering] = useState(false);
  const getTypeClassName = () => {
    return category.type.toLowerCase().replace(/\s/g, "-");
  };
  const handleClick = (e, category) => {
    e.preventDefault();
    if (preview) return false;
    setEditingCategory(category);
  };
  const handleItem = (category) => {
    if (preview) return false;
    setEditingItem({
      category: {
        _id: category._id,
      },
    });
  };
  const handleMove = async (category, amount) => {
    if (preview) return false;
    await moveCategory(category, amount);
    forceRender();
  };
  const drawItem = (category, item, index, dummy) => (
    <Item
      category={category}
      item={item}
      index={index}
      key={`item-${item._id}`}
      hovering={hovering}
      backgroundColor={backgroundColor}
      primaryColor={primaryColor}
      dummy={dummy}
    />
  );
  return (
    <div
      className={`resume__category ${
        !preview && !isMobile ? "resume__category--hoverable" : ""
      } resume__category--${getTypeClassName()}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering && !isMobile && !preview && (
        <span className="resume__actions">
          <Button
            fn={() => handleItem(category)}
            text={`Add ${category.name.toLowerCase()}`}
            textual={true}
          />
          {index > 0 && (
            <>
              <Separator />
              <Button
                fn={() => handleMove(category, -1)}
                text="Move up"
                altText="Moving..."
                textual={true}
              />
            </>
          )}
          {index <
            getCategories(editingResume, category.sidebar).length - 1 && (
            <>
              <Separator />
              <Button
                fn={() => handleMove(category, 1)}
                text="Move down"
                altText="Moving..."
                textual={true}
              />
            </>
          )}
        </span>
      )}
      <div>
        <h3
          className={`resume__category--name ${
            !preview && !isMobile ? "resume--hoverable" : ""
          }`}
          onClick={(e) => handleClick(e, category)}
          style={{
            color: primaryColor,
          }}
        >
          {category.name}
        </h3>
        <div className="resume__category--items-container">
          {getItems(category) && getItems(category).length > 0
            ? sortByPriority(getItems(category)).map((item, index) =>
                drawItem(category, item, index, false)
              )
            : drawItem(category, getDummyItem(category.name), 0, true)}
        </div>
      </div>
    </div>
  );
};

export default Category;
