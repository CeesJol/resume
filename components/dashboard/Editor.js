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
			category
		})
	}
  function drawItems() {
    const categories = resume.categories.data;

    if (categories.length > 0)
      return (
        <>
          <p>Click on any item to edit it</p>
          {categories.map((category, i) => (
            <div key={`category-${i}`}>
              <h2>{category.name}</h2>
							<a onClick={() => handleNewItem(category)}>Add item</a>
              {category.items.data.map((item, j) => (
                <NewItem key={`item-${i}-${j}`} item={item} />
              ))}
            </div>
          ))}
        </>
      );
    return <p>Nothing yet say what</p>;
  }

  return (
    <div className="dashboard__resume">
      <h4>{resume.title}</h4>
      {drawItems()}
      {editingItem !== -1 && <Popup />}
    </div>
  );
};
