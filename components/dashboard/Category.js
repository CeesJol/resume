import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import Item from "./Item";
import {
  getDummyItem,
  sortByPriority,
  getTypeClassName,
} from "../../lib/constants";
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
    isHoverable,
    appendHoverToClassName,
  } = useContext(UserContext);
  const [hovering, setHovering] = useState(false);
  const handleClick = (e, category) => {
    e.preventDefault();
    if (preview) return false;
    setEditingCategory(category);
  };
  const handleAddItem = (category) => {
    if (preview) return false;
    setEditingItem({
      categoryId: category.id,
    });
  };
  const handleMove = async (category, amount) => {
    if (preview) return false;
    await moveCategory(category, amount);
    forceRender();
  };
  const drawItems = () => {
    const items = getItems(category);
    if (!items || items.length === 0) {
      // There are no items in this category, draw dummy item
      return drawItem(category, getDummyItem(category.title), 0, true);
    }

    return sortByPriority(items).map((item, index) =>
      drawItem(category, item, index, false)
    );
  };
  const drawItem = (category, item, index, dummy) => (
    <Item
      category={category}
      item={item}
      index={index}
      key={`item-${item.id}`}
      hovering={hovering}
      backgroundColor={backgroundColor}
      primaryColor={primaryColor}
      dummy={dummy}
    />
  );
  const getCategoryClassName = () => {
    let className = `resume__category resume__category--${getTypeClassName(
      category
    )}`;
    if (isHoverable()) {
      className += " resume__category--hoverable";
    }
    return className;
  };
  const getTitleClassName = () => {
    return appendHoverToClassName("resume__category--name");
  };
  const drawCategoryActions = () => {
    if (!hovering || isMobile || preview) return;
    const drawAddItem = () => (
      <Button
        fn={() => handleAddItem(category)}
        text={`Add ${category.title.toLowerCase()}`}
        textual={true}
      />
    );
    const drawMoveUp = () => (
      <>
        <Separator />
        <Button
          fn={() => handleMove(category, -1)}
          text="Move up"
          altText="Moving..."
          textual={true}
        />
      </>
    );
    const drawMoveDown = () => (
      <>
        <Separator />
        <Button
          fn={() => handleMove(category, 1)}
          text="Move down"
          altText="Moving..."
          textual={true}
        />
      </>
    );
    const catLength = getCategories(editingResume, category.sidebar).length;
    return (
      <span className="resume__actions">
        {drawAddItem()}
        {index > 0 && drawMoveUp()}
        {index < catLength - 1 && drawMoveDown()}
      </span>
    );
  };
  return (
    <div
      className={getCategoryClassName()}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {drawCategoryActions()}
      <div>
        <h3
          className={getTitleClassName()}
          onClick={(e) => handleClick(e, category)}
          style={{
            color: primaryColor,
          }}
        >
          {category.title}
        </h3>
        <div className="resume__category--items-container">{drawItems()}</div>
      </div>
    </div>
  );
};

export default Category;
