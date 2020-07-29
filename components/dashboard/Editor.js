import { DashboardContext } from "../../contexts/dashboardContext";
import { UserContext } from "../../contexts/userContext";
import React, { useState, useEffect, useContext } from "react";
import NewItem from "./NewItem";
import Popup from "./Popup";

export default () => {
  const { setEditingItem, editingItem, editingResume } = useContext(
    DashboardContext
  );
  const { getUser } = useContext(UserContext);
  const handleNewItem = (category) => {
    setEditingItem({
      category,
    });
  };
  // const css = `* {
  // 	color: red !important;
  // }`
  const templateCSS = editingResume ? editingResume.template.style : "";
  function drawItems() {
    // if (editingResume != -1) return;
    const categories = editingResume.categories.data;

    if (categories.length > 0)
      return (
        <>
          {categories.map((category, i) => (
            <div className="resume__item" key={category._id}>
              <h2>{category.name}</h2>
              <a onClick={() => handleNewItem(category)}>
                <i>Add item</i>
              </a>
              {category.items.data.map((item, j) => (
                <div key={item._id}>
                  <NewItem item={item} />
                  <br />
                </div>
              ))}
            </div>
          ))}
        </>
      );
    return <p>Nothing yet say what</p>;
  }

  return (
    <>
      <div className="dashboard__item">
        <i>
          Editing <b>{editingResume.title}</b>
        </i>
        <p>Click on any item to edit it</p>
      </div>
      <div className="resume">
				<style>{templateCSS}</style>
        <div className="resume__item">
          <h1>{getUser().username}</h1>
        </div>
        {drawItems()}

        {editingItem !== -1 && <Popup />}
      </div>
    </>
  );
};
