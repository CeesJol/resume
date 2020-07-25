import React, { useContext } from "react";
import Item from "../user/Item";
import { DashboardContext } from "../../contexts/dashboardContext";
import { UserContext } from "../../contexts/userContext";

export default (props) => {
  const { setEditingItem } = useContext(DashboardContext);
  const { getUser } = useContext(UserContext);
  function handleClick(e, item) {
    e.preventDefault();
    console.log('iTEMMM', item);
    setEditingItem(item);
  }
  function drawItems() {
    console.log("getUser (local)", getUser());
    const data = getUser();
    // TODO update the few lines below
    if (!data) return <p>Loading...</p>;
    if (data === -1) return <p>Failed to load</p>;
    if (!data.resumes) return <p>404 - user not found</p>;

    const categories = data.resumes.data[0].categories.data;

    if (categories.length > 0)
      return (
        <>
          <p>Click on any item to edit it</p>
          {categories.map((category, i) => (
            <>
              <h2>{category.name}</h2>
              {category.items.data.map((item, j) => (
                <Item
                  key={`item-${i}-${j}`}
                  item={item}
                  handleClick={handleClick}
                />
              ))}
            </>
          ))}
        </>
      );
    return <p>Get started by creating your resume</p>;
  }

  return (
    <div className="dashboard__items">
      <h4>Your resume</h4>
      <div id="items-container">{drawItems()}</div>
    </div>
  );
};
