import { UserContext } from "../../contexts/userContext";
import React, { useState, useEffect, useContext } from "react";
import Category from "./Category";

export default () => {
  const {
    getUser,
    setEditingItem,
    editingItem,
    editingCategory,
    setEditingCategory,
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
  const templateCSS = editingResume.template.style;
  const sortByPriority = (list) => {
    return list.sort((item1, item2) => {
      return item1.priority < item2.priority ? -1 : 1;
    });
  };
  const drawCategory = (category, index) => {
    return <Category key={category._id} category={category} index={index} />;
  };
  const drawHeader = () => {
    return (
      <div
        className="resume__header resume__container"
        onClick={handleChangeInfo}
      >
        <h1 className="resume__header--name">
          {getUser() && getUser().username}
        </h1>
        <h3 className="resume__header--job-title">
          {editingResume.jobTitle || "Job title"}
        </h3>
        <p className="resume__header--bio multiline">
          {editingResume.bio || "Bio"}
        </p>
      </div>
    );
	};
	const drawContactInfo = () => {
    return (
      <div
        className="resume__contact-info resume__container"
        onClick={handleChangeInfo}
      >
        contact enfoo
      </div>
    );
  };
  const drawItems = () => {
    if (!editingResume.categories) return <p>Nothing here yet</p>;

    const categories = sortByPriority(editingResume.categories.data);
    // if (editingResume.template.sidebar) {
    //   const mainCategories = categories.filter(
    //     (category) => category.priority < 1000
    //   );
    //   const sidebarCategories = categories.filter(
    //     (category) => category.priority >= 1000
    //   );

    //   return (
    //     <>
    //       <div className="resume__container">
    //         {mainCategories.map((category, index) => drawCategory(category, index))}
    //       </div>
    //       <div className="resume__container">
    //         {sidebarCategories.map((category, index) => drawCategory(category, index))}
    //       </div>
    //     </>
    //   );
    // } else {
    return (
      <div className="resume__container">
        {categories.map((category, index) => drawCategory(category, index))}
        <a onClick={handleNewCategory}>
          <i>Create category</i>
        </a>
      </div>
    );
    // }
  };
  const handleGoBack = () => {
    setEditingResume(-1);
  };
  const handleNewCategory = () => {
    setEditingCategory({});
  };
  return (
    <>
      <div className="dashboard__item">
        <i>
          Editing <b>{editingResume.title}</b>
        </i>
        <p>Click on any item to edit it</p>
        <a onClick={handleGoBack}>Back to your resumes</a>
      </div>
      <div className="resume">
        <style>{templateCSS}</style>
        {drawHeader()}
				{drawContactInfo()}
        {drawItems()}
      </div>
    </>
  );
};
