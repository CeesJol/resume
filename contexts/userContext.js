import React, { createContext, useState, useEffect } from "react";
import Router from "next/router";
import {
  DUMMY_RESUME,
  CONTACTPICKER_OPTIONS,
  ALL_CATEGORIES,
} from "../lib/constants";
import { fauna, send } from "../lib/api";
import { toastError } from "../lib/error";
import { isMobile } from "react-device-detect";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  // User
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [loggingOut, setLoggingOut] = useState(null);

  // Resume
  const [resumes, setResumes] = useState([]);
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
  const getContactInfo = (resume) => {
    return (resume || editingResume).data.contactInfo || [];
  };
  const getCategories = (resume, sidebar) => {
    const curResume = resume || editingResume;
    const categories = curResume.data.categories;
    if (sidebar !== undefined && curResume.sidebar) {
      return categories.filter((cat) => cat.sidebar === sidebar);
    }
    return categories;
  };
  const getItems = (category) => {
    return category && category.items;
  };
  const getJobTitle = (resume) => {
    return (resume || editingResume).jobTitle || "Job Title";
  };
  const getBio = (resume) => {
    return (resume || editingResume).bio || "";
  };
  const createResume = (resumeData) => {
    resumes.push(resumeData);
    resetPopups();
  };
  const deleteResume = (resumeData) => {
    const newResumes = resumes.reduce((result, curResume) => {
      // Delete the resume
      if (curResume._id === resumeData._id) return result;

      // Propagate priority updates
      if (curResume.priority > editingResume.priority) {
        return result.concat({
          ...curResume,
          priority: curResume.priority - 1,
        });
      }

      return result.concat(curResume);
    }, []);
    setResumes(newResumes);
    reset();
    resetPopups();
  };
  const updateResume = async (resumeData) => {
    const newResume = {
      ...resumes.find((r) => r._id === resumeData._id),
      ...resumeData,
    };
    if (editingResume._id === resumeData._id) {
      setEditingResume(newResume);
    }
    const res = resumes.map((r) => {
      if (r._id === newResume._id) {
        return newResume;
      }
      return r;
    });
    setResumes(res);
    resetPopups();
    await storeResume(resumeData);
  };
  const updateSpecificResume = (resumeData) => {
    // Update a resume which is not per se editingResume
    resumes.forEach((resume, r) => {
      if (resume._id === resumeData._id) {
        const newResume = { ...resume, ...resumeData };
        resumes[r] = newResume;
      }
    });
    resetPopups();
    storeResume(resumeData);
  };
  const storeStatusSuccess = () => {
    setStatus("✅ Saved.");
  };
  const storeStatusSaving = () => {
    setStatus("💾 Saving...");
  };
  const storeStatusError = (err) => {
    setStatus("⚠️ Error: failed to save");
    console.error("err", err);
  };
  const storeResume = async (resumeData) => {
    if (!resumeData) resumeData = { data: editingResume.data };
    storeStatusSaving();
    await fauna({
      type: "UPDATE_RESUME",
      id: resumeData._id || editingResume._id,
      data: resumeData,
    }).then(
      () => storeStatusSuccess(),
      (err) => storeStatusError(err)
    );
  };
  const createCategory = (categoryData) => {
    editingResume.data.categories.push(categoryData);
    resetPopups();
    storeResume();
  };
  const deleteCategory = async (categoryData) => {
    editingResume.data.categories = editingResume.data.categories.filter(
      (cat) => cat.id !== categoryData.id
    );
    resetPopups();
    await storeResume();
  };
  const updateCategory = (categoryData) => {
    editingResume.data.categories = editingResume.data.categories.map((cat) => {
      if (cat.id === categoryData.id) {
        return categoryData;
      }
      return cat;
    });
    resetPopups();
    storeResume();
  };
  const createItem = (itemData) => {
    getCategory(itemData.categoryId).items.push(itemData);
    resetPopups();
    storeResume();
  };
  const deleteItem = async (itemData) => {
    const category = getCategory(itemData.categoryId);
    category.items = category.items.filter((item) => item.id !== itemData.id);
    resetPopups();
    await storeResume();
  };
  const updateItem = (itemData) => {
    const category = getCategory(itemData.categoryId);
    category.items = category.items.map((item) => {
      if (item.id === itemData.id) {
        return itemData;
      }
      return item;
    });
    resetPopups();
    storeResume();
  };
  const createContactInfo = (contactInfoData) => {
    editingResume.data.contactInfo.push(contactInfoData);
    resetPopups();
    storeResume();
  };
  const deleteContactInfo = async (contactInfoData) => {
    editingResume.data.contactInfo = editingResume.data.contactInfo.filter(
      (cat) => cat.id !== contactInfoData.id
    );
    resetPopups();
    await storeResume();
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
    resetPopups();
    storeResume();
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
        let otherResume = resumes.find((resume) => resume.priority === p);

        // Update priority
        otherResume.priority -= amount;
        resume.priority += amount;
        updateSpecificResume(otherResume);
        updateSpecificResume(resume);

        resetPopups();
        storeStatusSuccess();
      },
      (err) => storeStatusError(err)
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
    if (resumes.length === 0) setEditingResume(DUMMY_RESUME);
    setNav(0);
    setStatus("");
    resetPopups();
  };
  const isHoverable = () => {
    return !preview && !isMobile;
  };
  const appendHoverToClassName = (className) => {
    if (isHoverable()) return className + " resume--hoverable";
    return className;
  };
  const storeData = (data) => {
    // Convert resume data
    let { resumes: userResumes, ...userData } = data;
    userResumes = userResumes.data.map((res) => ({
      ...res,
      data: JSON.parse(res.data),
    }));

    // Store data
    storeUser(userData);
    setResumes(userResumes);

    // Log data
    console.info("userData");
    console.table(userData);
    console.info("Resumes");
    console.table(userResumes);

    // Set auth
    setAuth(true);
  };

  const handleLogin = async (email, password) => {
    await fauna({ type: "LOGIN_USER", email, password }).then(
      async (data) => {
        storeData(data);
        localStorage.setItem("userId", JSON.stringify(data._id));
        Router.push("/dashboard");
      },
      (err) => {
        toastError(err);
        console.error("login err", err);
      }
    );
  };
  const handleSignUp = async (email, username, password) => {
    await fauna({ type: "CREATE_USER", email, username, password }).then(
      async (data) => {
        const id = data.createUser._id;
        send({ type: "SEND_CONFIRMATION_EMAIL", id, email });
        await handleLogin(email, password);
      },
      (err) => {
        toastError(err);
        console.error("signup err", err);
      }
    );
  };
  const getUnusedContactOptions = () => {
    return Object.keys(CONTACTPICKER_OPTIONS).filter((item) => {
      for (let item2 of editingResume.data.contactInfo) {
        // Do show the name of the contact item that's being edited
        if (editingContactInfo.name === item2.name) continue;
        // Don't show contact item types that have been used already
        if (item === item2.name) {
          return false;
        }
      }
      return true;
    });
  };
  const getUnusedCategories = () => {
    return ALL_CATEGORIES.filter((cat) => {
      for (let cat2 of editingResume.data.categories) {
        // Do show the title of the category that's being edited
        if (editingCategory.title === cat2.title) continue;
        // Don't show category types that have been used already
        if (cat.title === cat2.title) {
          return false;
        }
      }
      return true;
    });
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
        // Check result
        if (!data.findUserByID) {
          console.error("Unauthenticated. Data:", data);
          toastError("Unauthenticated");
          clearUser();
          return;
        }

        // Store data
        storeData(data.findUserByID);
      },
      (err) => {
        toastError(err);
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
        moving,
        setMoving,
        isHoverable,
        appendHoverToClassName,
        resumes,
        storeData,
        handleLogin,
        handleSignUp,
        getUnusedContactOptions,
        getUnusedCategories,
        storeStatusError,
        storeStatusSuccess,
        storeStatusSaving,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
