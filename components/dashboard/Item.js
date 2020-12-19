import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { getCategoryItems, getValueDescription } from "../../lib/constants";
import Button from "../general/Button";
import Separator from "./Separator";
import { isMobile } from "react-device-detect";
import ReactMarkdown from "react-markdown";

const Item = ({ category, item, index, dummy, hovering, primaryColor }) => {
  const {
    setEditingItem,
    moveItem,
    forceRender,
    preview,
    getItems,
  } = useContext(UserContext);
  const categoryItems = getCategoryItems(category.type);
  const getTypeClassName = () => {
    return category.type.toLowerCase().replace(/\s/g, "-");
  };
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
      values.push(i >= (item.value || 3));
    }

    return values.map((value, i) => (
      <div
        key={`${item.id}-${i}`}
        className={`resume__item--value-box ${
          value ? "resume__item--value-box--colored" : ""
        }`}
        style={{
          backgroundColor: !value ? primaryColor : "",
        }}
      ></div>
    ));
  };
  return (
    <div
      className={`resume__item resume__item--${getTypeClassName()} ${
        !preview && !isMobile ? "resume--hoverable" : ""
      }`}
      style={
        getTypeClassName() === "title-without-value"
          ? {
              backgroundColor: primaryColor,
            }
          : {}
      }
      onClick={(e) => handleClick(e, item)}
      key={item.id}
    >
      <h4 className="resume__item--title">{item.title}</h4>
      {hovering &&
        !isMobile &&
        !preview &&
        !dummy &&
        getTypeClassName() !== "title-without-value" && (
          <>
            {index > 0 && (
              <span onClick={(e) => e.stopPropagation()}>
                <Separator />
                <Button
                  fn={() => handleMove(item, -1)}
                  text="Move up"
                  altText="Moving..."
                  textual={true}
                />
              </span>
            )}
            {index < getItems(category).length - 1 && (
              <span onClick={(e) => e.stopPropagation()}>
                <Separator />
                <Button
                  fn={() => handleMove(item, 1)}
                  text="Move down"
                  altText="Moving..."
                  textual={true}
                />
              </span>
            )}
          </>
        )}
      <h4 className="resume__item--location">{item.location}</h4>
      {item.year1 && (
        <p className="resume__item--date">
          {item.month1 ? item.month1 + "/" : ""}
          {item.year1}
          {item.year2 &&
            " - " + (item.month2 ? item.month2 + "/" : "") + item.year2}
          {!item.year2 && categoryItems.includes("year2") && " - Present"}
        </p>
      )}
      {category.type === "Title and value" && (
        <div className="resume__item--value">
          {drawValue()}
          <p className="resume__item--value--title">
            {getValueDescription(item.value)}
          </p>
        </div>
      )}
      {item.description && (
        // No markdown
        // <p className="resume__item--description multiline">
        //   {item.description}
        // </p>
        // Markdown
        <ReactMarkdown
          source={item.description}
          className="resume__item--description multiline"
          escapeHtml={false}
        />
      )}
    </div>
  );
};

export default Item;
