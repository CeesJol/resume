import { UserContext } from "../../contexts/userContext";
import React, { useState, useEffect, useContext } from "react";
import Category from "./Category";
import Popup from "./popups/Popup";
import UserPopup from "./popups/UserPopup";
import Warning from "./popups/Warning";

export default () => {
  const {
    getUser,
    setEditingItem,
    editingItem,
    setEditingResume,
    editingResume,
    warning,
    setWarning,
    changingInfo,
    setChangingInfo,
  } = useContext(UserContext);
  const handleChangeInfo = () => {
    setChangingInfo(true);
  };
  const templateCSS = editingResume ? editingResume.template.style : "";
  const drawCategory = (category) => {
    return (
      <Category key={category._id} category={category} />
    );
  };
  const drawItems = () => {
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
        <a>
          <div
            className="resume__container resume__container--header"
            onClick={handleChangeInfo}
          >
            <h1>{getUser() && getUser().username}</h1>
            <p className="resume__job-title">
              {editingResume.jobTitle || "Job title"}
            </p>
            <p className="resume__bio multiline">
              {editingResume.bio || "Bio"}
            </p>
          </div>
        </a>
        {drawItems()}

        {editingItem !== -1 && <Popup />}
        {changingInfo && <UserPopup />}
        {warning && <Warning />}
      </div>
    </>
  );
};
