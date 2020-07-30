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
  const templateCSS = editingResume ? editingResume.template.style : "";
  const drawCategory = (category) => {
    return (
      <div key={category._id}>
        <h2>{category.name}</h2>
        <a onClick={() => handleNewItem(category)}>
          <i>Add item</i>
        </a>
        {category.items.data.map((item) => (
          <div className="resume__item" key={item._id}>
            <NewItem item={item} />
            <br />
          </div>
        ))}
      </div>
    );
  };
  function drawItems() {
    const categories = editingResume.categories.data.sort((cat1, cat2) =>
      cat1.priority < cat2.priority ? 1 : -1
    );
    if (editingResume.template.sidebar) {
      const mainCategories = categories.filter(
        (category) => category.priority < 1000
      );
      const sidebarCategories = categories.filter(
        (category) => category.priority >= 1000
      );

      return (
        <>
          <div className="resume__container">
            {mainCategories.map((category) => drawCategory(category))}
          </div>
          <div className="resume__container">
            {sidebarCategories.map((category) => drawCategory(category))}
          </div>
        </>
      );
    } else {
      return (
        <div className="resume__container">
          {categories.map((category) => drawCategory(category))}
        </div>
      );
    }
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
        <div className="resume__container resume__container--header">
          <h1>{getUser().username}</h1>
        </div>
        {drawItems()}

        {editingItem !== -1 && <Popup />}
      </div>
    </>
  );
};
