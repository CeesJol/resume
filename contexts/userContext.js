import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Router from "next/router";
import { DUMMY_RESUME } from "../lib/constants";
import { fauna } from "../lib/api";
import { isMobile } from "react-device-detect";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  // User
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [loggingOut, setLoggingOut] = useState(null);

  // Resume
  const [dummy, setDummy] = useState(false);
  const [editingItem, setEditingItem] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingResume, setEditingResume] = useState(DUMMY_RESUME); // Most recently edited resume
  const [changingResume, setChangingResume] = useState(false); // Whether user is changing a resume
  const [creatingResume, setCreatingResume] = useState(false);
  const [nav, setNav] = useState(0);
  const [changingInfo, setChangingInfo] = useState(false);
  const [editingContactInfo, setEditingContactInfo] = useState(false);
  const [warning, setWarning] = useState(false);
  const [userMadeChanges, setUserMadeChanges] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [preview, setPreview] = useState(true);
  const [pdf, setPdf] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [status, setStatus] = useState(""); // Save status (saved / error)
  const [moving, setMoving] = useState(false);

  const storeStatus = (data, err) => {
    if (err) {
      console.error("storeStatus err report:", err);
    }

    setStatus(data);
  };
  const forceRender = () => {
    setDummy(!dummy);
  };
  const storeUser = (data) => {
    setUser((prevUser) => ({ ...prevUser, ...data }));
  };
  const getCategory = (categoryId) => {
    return editingResume.data.categories.find(
      (category) => category.id === categoryId
    );
  };
  const getResumes = () => {
    return userExists() && user.resumes.data;
  };
  const getContactInfo = (resume) => {
    return (resume || editingResume).data.contactInfo || [];
  };
  const getCategories = (resume, sidebar) => {
    const cur = (resume || editingResume).data.categories;
    if (sidebar !== undefined)
      return cur.filter((cat) => cat.sidebar === sidebar);
    return cur;
  };
  const getItems = (category) => {
    return category && category.items;
  };
  const getJobTitle = (resume) => {
    return (resume || editingResume).jobTitle || "Job Title";
  };
  const getBio = (resume) => {
    return (resume || editingResume).bio || "Bio";
  };
  const postResumeAction = () => {
    resetPopups();
    storeResume();
  };
  const createResume = (resumeData) => {
    user.resumes.data.push(resumeData);
    postResumeAction();
  };
  const deleteResume = (resumeData) => {
    user.resumes.data = user.resumes.data.filter(
      (x) => x._id !== resumeData._id
    );
    reset();
    postResumeAction();
  };
  const updateResume = (resumeData) => {
    setEditingResume({ ...editingResume, ...resumeData });
    postResumeAction();
  };
  const updateSpecificResume = (resumeData) => {
    // Update a resume which is not per se editingResume
    user.resumes.data.forEach((resume, r) => {
      if (resume._id === resumeData._id) {
        const newResume = { ...resume, ...resumeData };
        user.resumes.data[r] = newResume;
      }
    });
    postResumeAction();
  };
  const storeResume = () => {
    storeStatus("Saving...");
    fauna({
      type: "UPDATE_RESUME",
      id: editingResume._id,
      data: editingResume,
    }).then(
      () => storeStatus("Saved."),
      (err) => storeStatus("Error: failed to save", err)
    );
  };
  const createCategory = (categoryData) => {
    editingResume.data.categories.push(categoryData);
    postResumeAction();
  };
  const deleteCategory = (categoryData) => {
    editingResume.data.categories = editingResume.data.categories.filter(
      (cat) => cat.id !== categoryData.id
    );
    postResumeAction();
  };
  const updateCategory = (categoryData) => {
    editingResume.data.categories = editingResume.data.categories.map((cat) => {
      if (cat.id === categoryData.id) {
        return categoryData;
      }
      return cat;
    });
    postResumeAction();
  };
  const createItem = (itemData) => {
    getCategory(itemData.categoryId).items.push(itemData);
    postResumeAction();
  };
  const deleteItem = (itemData) => {
    const category = getCategory(itemData.categoryId);
    category.items = category.items.filter((item) => item.id !== itemData.id);
    postResumeAction();
  };
  const updateItem = (itemData) => {
    const category = getCategory(itemData.categoryId);
    category.items = category.items.map((item) => {
      if (item.id === itemData.id) {
        return itemData;
      }
      return item;
    });
    postResumeAction();
  };
  const createContactInfo = (contactInfoData) => {
    editingResume.data.contactInfo.push(contactInfoData);
    postResumeAction();
  };
  const deleteContactInfo = (contactInfoData) => {
    editingResume.data.contactInfo = editingResume.data.contactInfo.filter(
      (cat) => cat.id !== contactInfoData.id
    );
    postResumeAction();
  };
  const updateContactInfo = (contactInfoData) => {
    editingResume.data.contactInfo = editingResume.data.contactInfo.map(
      (cat) => {
        if (cat.id === contactInfoData.id) {
          return contactInfoData;
        }
        return cat;
      }
    );
    postResumeAction();
  };
  const clearUser = () => {
    console.info("clearUser");

    const userId = JSON.parse(localStorage.getItem("userId"));
    console.info("userId", userId);

    // Get user away from dashboard
    if (Router.pathname.startsWith("/dashboard")) {
      Router.push("/login");
    }

    // Reset localstorage
    localStorage.removeItem("userId");

    // Reset state
    setUser(null);
    setEditingResume(DUMMY_RESUME);
    reset();
  };
  const userExists = () => {
    return !!user && user.username;
  };
  const moveItem = async (item, amount) => {
    // Store item and current index
    const movingItem = item;
    let items = getCategory(item.categoryId).items;
    const curIndex = items.indexOf(item);

    // Remove item from array
    items = items.filter((i) => i.id !== item.id);

    // Re-insert item at proper spot
    items.splice(curIndex + amount, 0, movingItem);

    // Save
    getCategory(item.categoryId).items = items;

    // Send updates to fauna
    storeResume();
  };
  const moveCategory = async (category, amount) => {
    // Store item and current index
    const movingCategory = category;
    let categories = editingResume.data.categories;
    const curIndex = categories.indexOf(category);

    // Remove item from array
    categories = categories.filter((c) => c.id !== category.id);

    // Re-insert item at proper spot
    categories.splice(curIndex + amount, 0, movingCategory);

    // Save
    editingResume.data.categories = categories;

    // Send updates to fauna
    storeResume();
  };
  const moveResume = async (resume, amount) => {
    if (moving) return false;
    setMoving(true);

    // Send to fauna
    await fauna({
      type: "MOVE_RESUME",
      id: resume._id,
      amount,
    }).then(
      () => {
        // Find item with priority p
        const p = resume.priority + amount;
        let otherResume = user.resumes.data.find(
          (resume) => resume.priority === p
        );

        // Update priority
        otherResume.priority -= amount;
        resume.priority += amount;
        updateSpecificResume(otherResume);
        updateSpecificResume(resume);

        resetPopups();
        storeStatus("Saved.");
      },
      (err) => storeStatus("Error: failed to save", err)
    );

    setMoving(false);
  };
  const resetPopups = () => {
    setChangingInfo(false);
    setEditingContactInfo(false);
    setEditingItem(false);
    setEditingCategory(false);
    setCreatingResume(false);
    setWarning(false);
    setUserMadeChanges(false);
    // setSelectedTemplateId(0);
  };
  const reset = () => {
    setChangingResume(false);
    // setEditingResume(false);
    if (user && user.resumes.data.length === 0) setEditingResume(DUMMY_RESUME);
    setNav(0);
    storeStatus("");
    resetPopups();
  };
  const isHoverable = () => {
    return !preview && !isMobile;
  };
  const appendHoverToClassName = (className) => {
    if (isHoverable()) return className + " resume--hoverable";
    return className;
  };
  useEffect(() => {
    if (!!user) {
      // User value is already read
      return;
    }
    const userId = JSON.parse(localStorage.getItem("userId"));
    if (userId === null) {
      // There is no user data
      console.info("No user data");
      clearUser();
      return;
    }
    fauna({ type: "READ_USER", id: userId }).then(
      (data) => {
        if (!data.findUserByID) {
          console.error("Unauthenticated. Data:", data);
          toast.error(`⚠️ Unauthenticated`);
          clearUser();
          return;
        }
        setEditingResume(data.findUserByID.resumes.data[0] || DUMMY_RESUME);
        // Convert resume data
        data.findUserByID.resumes.data = data.findUserByID.resumes.data.map(
          (res) => ({ ...res, data: JSON.parse(res.data) })
        );
        storeUser(data.findUserByID);
        console.info("readUser");
        console.table(data.findUserByID);
        setAuth(true);
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("Failed getting the user data:", err);
        clearUser();
      }
    );
  }, []);
  return (
    <UserContext.Provider
      value={{
        forceRender,
        storeUser,
        user,
        clearUser,
        userExists,
        auth,
        setAuth,
        nav,
        setNav,
        editingItem,
        setEditingItem,
        editingCategory,
        setEditingCategory,
        editingResume,
        setEditingResume,
        changingResume,
        setChangingResume,
        creatingResume,
        setCreatingResume,
        warning,
        setWarning,
        changingInfo,
        setChangingInfo,
        editingContactInfo,
        setEditingContactInfo,
        moveItem,
        moveCategory,
        moveResume,
        createItem,
        deleteItem,
        updateItem,
        createResume,
        deleteResume,
        updateResume,
        storeResume,
        createCategory,
        deleteCategory,
        updateCategory,
        createContactInfo,
        deleteContactInfo,
        updateContactInfo,
        userMadeChanges,
        setUserMadeChanges,
        resetPopups,
        getCategory,
        selectedTemplateId,
        setSelectedTemplateId,
        getCategories,
        getItems,
        getResumes,
        getContactInfo,
        getJobTitle,
        getBio,
        preview,
        setPreview,
        pdf,
        setPdf,
        loggingOut,
        setLoggingOut,
        templates,
        setTemplates,
        reset,
        status,
        storeStatus,
        moving,
        setMoving,
        isHoverable,
        appendHoverToClassName,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
