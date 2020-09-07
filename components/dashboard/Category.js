import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import NewItem from "./NewItem";
import { GET_DUMMY_ITEM } from "../../lib/constants";
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
  const handleNewItem = (category) => {
    if (preview) return false;
    setEditingItem({
      category: {
        _id: category._id,
      },
    });
  };
  const sortByPriority = (list) => {
    return list.sort((item1, item2) => {
      return item1.priority < item2.priority ? -1 : 1;
    });
  };
  const handleMove = async (category, amount) => {
    if (preview) return false;
    await moveCategory(category, amount);
    forceRender();
  };
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
            fn={() => handleNewItem(category)}
            text={` Add ${category.name.toLowerCase()}`}
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
        {getItems(category) && getItems(category).length > 0 ? (
          <div className="resume__category--items-container">
            {sortByPriority(getItems(category)).map((item, index) => (
              <NewItem
                category={category}
                item={item}
                index={index}
                key={item._id}
                hovering={hovering}
                backgroundColor={backgroundColor}
                primaryColor={primaryColor}
              />
            ))}
          </div>
        ) : (
          <div className="resume__category--items-container">
            <NewItem
              category={category}
              item={GET_DUMMY_ITEM(category.name)}
              index={0}
              dummy={true}
              hovering={hovering}
              backgroundColor={backgroundColor}
              primaryColor={primaryColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
