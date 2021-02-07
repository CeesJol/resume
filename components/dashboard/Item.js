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
    editingResume,
  } = useContext(UserContext);
  const categoryItems = getCategoryItems(category);
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
      <span
        className="resume__item--action-container"
        onClick={(e) => e.stopPropagation()}
      >
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
      <span
        className="resume__item--action-container"
        onClick={(e) => e.stopPropagation()}
      >
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
  const drawItemTitle = () => {
    return (
      <h4
        className="resume__item--title"
        style={{
          fontSize: editingResume.fontSize,
        }}
      >
        {item.degree
          ? item.degree + (item.GPA ? ` (GPA: ${item.GPA})` : "")
          : item.title}
        {item.company ? `, ${item.company}` : ""}
      </h4>
    );
  };
  const drawItemLocation = () => {
    return (
      <h4
        className="resume__item--location"
        style={{
          fontSize: editingResume.fontSize,
        }}
      >
        {item.organization || item.location}
      </h4>
    );
  };
  const drawItemDate = () => {
    if (!item.year1) return;
    return (
      <p
        className="resume__item--date"
        style={{
          fontSize: editingResume.fontSize,
        }}
      >
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
        <p
          className="resume__item--value--title"
          style={{
            fontSize: editingResume.fontSize,
          }}
        >
          {getValueDescription(item.value)}
        </p>
      </div>
    );
  };
  const drawItemDescription = () => {
    if (!item.description) return;
    return (
      <div
        style={{
          fontSize: editingResume.fontSize,
        }}
      >
        <ReactMarkdown
          source={item.description}
          className="resume__item--description multiline"
          escapeHtml={false}
        />
      </div>
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
