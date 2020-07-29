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
  const resume = getUser().resumes.data.find(
    (resume) => resume._id === editingResume
  );
  const handleNewItem = (category) => {
    setEditingItem({
      category,
    });
  };
  function drawItems() {
    const categories = resume.categories.data;

    if (categories.length > 0)
      return (
        <>
          {categories.map((category, i) => (
            <div key={category._id}>
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
        Editing <b>{resume.title}</b>
      </i>
			<p>Click on any item to edit it</p>
		</div>
    <div className="dashboard__item dashboard__item--noborder">
      
      <h1>{getUser().username}</h1>
      {drawItems()}

      {editingItem !== -1 && <Popup />}
    </div>
		</>
  );
};
