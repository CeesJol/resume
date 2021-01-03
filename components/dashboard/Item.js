import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { getCategoryItems, getValueDescription } from "../../lib/constants";
import { getTypeClassName } from "../../lib/util";
import Button from "../general/Button";
import Separator from "./Separator";
import ReactMarkdown from "react-markdown";

const Item = ({ category, item, index, dummy, hovering, primaryColor }) => {
  const {
    setEditingItem,
    moveItem,
    forceRender,
    preview,
    getItems,
    isHoverable,
    appendHoverToClassName,
  } = useContext(UserContext);
  const categoryItems = getCategoryItems(category.type);
  const handleClick = (e, item) => {
    e.preventDefault();
    if (preview) return false;
    if (dummy)
      setEditingItem({
        categoryId: category.id,
      });
    else setEditingItem(item);
  };
  const handleMove = async (item, amount) => {
    if (preview || dummy) return false;
    await moveItem(item, amount);
    forceRender();
  };
  const drawValue = () => {
    const values = [];
    for (let i = 0; i < 5; i++) {
      // Set value to true if index is larger than the itemValue
      // Then a dot will be colored if its index is larger than the given value
      values.push(i >= (item.value || 3));
    }

    const getClassName = (value) => {
      let className = "resume__item--value-box";
      if (value) {
        className += " resume__item--value-box--colored";
      }
      return className;
    };

    return values.map((value, i) => (
      <div
        key={`${item.id}-${i}`}
        className={getClassName(value)}
        style={{
          backgroundColor: !value ? primaryColor : "",
        }}
      ></div>
    ));
  };
  const getItemClassName = () => {
    let className = `resume__item resume__item--${getTypeClassName(category)}`;
    return appendHoverToClassName(className);
  };
  const getItemStyle = () => {
    if (item.type === "Title without value") {
      return {
        backgroundColor: primaryColor,
      };
    }
    return {};
  };
  const drawItemTitle = () => {
    return <h4 className="resume__item--title">{item.title}</h4>;
  };
  const drawItemActions = () => {
    if (
      !hovering ||
      !isHoverable() ||
      dummy ||
      item.type === "Title without value"
    ) {
      return;
    }
    const drawMoveUp = () => (
      <span onClick={(e) => e.stopPropagation()}>
        <Separator />
        <Button
          fn={() => handleMove(item, -1)}
          text="Move up"
          altText="Moving..."
          textual={true}
        />
      </span>
    );
    const drawMoveDown = () => (
      <span onClick={(e) => e.stopPropagation()}>
        <Separator />
        <Button
          fn={() => handleMove(item, 1)}
          text="Move down"
          altText="Moving..."
          textual={true}
        />
      </span>
    );
    return (
      <>
        {index > 0 && drawMoveUp()}
        {index < getItems(category).length - 1 && drawMoveDown()}
      </>
    );
  };
  const drawItemLocation = () => {
    return <h4 className="resume__item--location">{item.location}</h4>;
  };
  const drawItemDate = () => {
    if (!item.year1) return;
    return (
      <p className="resume__item--date">
        {item.month1 ? item.month1 + "/" : ""}
        {item.year1}
        {item.year2 &&
          " - " + (item.month2 ? item.month2 + "/" : "") + item.year2}
        {!item.year2 && categoryItems.includes("year2") && " - Present"}
      </p>
    );
  };
  const drawItemValue = () => {
    if (category.type !== "Title and value") return;
    return (
      <div className="resume__item--value">
        {drawValue()}
        <p className="resume__item--value--title">
          {getValueDescription(item.value)}
        </p>
      </div>
    );
  };
  const drawItemDescription = () => {
    if (!item.description) return;
    return (
      <ReactMarkdown
        source={item.description}
        className="resume__item--description multiline"
        escapeHtml={false}
      />
    );
  };
  return (
    <div
      className={getItemClassName()}
      style={getItemStyle()}
      onClick={(e) => handleClick(e, item)}
      key={item.id}
    >
      {drawItemTitle()}
      {drawItemActions()}
      {drawItemLocation()}
      {drawItemDate()}
      {drawItemValue()}
      {drawItemDescription()}
    </div>
  );
};

export default Item;
