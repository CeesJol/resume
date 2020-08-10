import React, { createContext, useState, useEffect } from "react";
export const UserContext = createContext();
import { identity } from "../pages/api/auth";
import { readUser, updateItem, updateCategory } from "../pages/api/fauna";
import { toast } from "react-toastify";
import Router from "next/router";

const UserContextProvider = (props) => {
  const [dummy, setDummy] = useState(false);
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [nav, setNav] = useState(0);
  const [editingItem, setEditingItem] = useState(-1);
  const [editingCategory, setEditingCategory] = useState(-1);
  const [editingResume, setEditingResume] = useState(-1);
  const [creatingResume, setCreatingResume] = useState(-1);
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  const [warning, setWarning] = useState(false);
  const [changingInfo, setChangingInfo] = useState(false);
  const [editingContactInfo, setEditingContactInfo] = useState(-1);
  const [userMadeChanges, setUserMadeChanges] = useState(false);
  const [moving, setMoving] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [preview, setPreview] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [loggingOut, setLoggingOut] = useState(null);
  const forceRender = () => {
    setDummy(!dummy);
  };
  const storeUser = (data) => {
    setUser((prevUser) => ({ ...prevUser, ...data }));
  };
  const storeItem = (itemData, { del, add }) => {
    var user = getUser();

    // jr developer: the code isnt that bad
    // the code:
    user.resumes.data.some((resume, r) => {
      if (resume._id === editingResume._id) {
        resume.categories.data.some((category, c) => {
          if (category._id === itemData.category._id) {
            if (add) {
              // Add item
              user.resumes.data[r].categories.data[c].items.data.push(itemData);
              // setEditingItem(itemData);
              return true; // break the loop
            } else if (del) {
              // Delete item
              user.resumes.data[r].categories.data[
                c
              ].items.data = user.resumes.data[r].categories.data[
                c
              ].items.data.filter((x) => x._id !== itemData._id);
              return true; // break the loop
            }
            category.items.data.some((item, i) => {
              if (item._id === itemData._id) {
                // Update item
                const newItem = { ...item, ...itemData };
                user.resumes.data[r].categories.data[c].items.data[i] = newItem;
                // setEditingItem(newItem);
                return true; // break the loop
              }
            });
            return true; // break the loop
          }
        });
        return true; // break the loop
      }
    });

    setUser(() => user);
  };
  const getCategory = (categoryId) => {
    return editingResume.categories.data.find(
      (category) => category._id === categoryId
    );
  };
  const getCategories = () => {
    return editingResume.categories.data;
  };
  const storeResume = (resumeData, { add, del }) => {
    var user = getUser();

    if (del) {
      // Delete resume
      user.resumes.data = user.resumes.data.filter(
        (x) => x._id !== resumeData._id
      );
      return;
    } else if (add) {
      // Add resume
      user.resumes.data.push(resumeData);
      setEditingResume(resumeData);
      return;
    }

    user.resumes.data.forEach((resume, r) => {
      if (resume._id === editingResume._id) {
        const newResume = { ...resume, ...resumeData };
        user.resumes.data[r] = newResume;
        setEditingResume(newResume);
      }
    });

    setUser(() => user);
  };
  const storeContactInfo = (contactInfoData, { add, del }) => {
    var user = getUser();

    user.resumes.data.some((resume, r) => {
      if (resume._id === editingResume._id) {
        if (add) {
          // Add contactInfo
          user.resumes.data[r].contactInfo.data.push(contactInfoData);
          return true; // break the loop
        }
        resume.contactInfo.data.some((contactInfo, c) => {
          if (contactInfo._id === contactInfoData._id) {
            if (del) {
              // Delete contactInfo
              user.resumes.data[r].contactInfo.data = user.resumes.data[
                r
              ].contactInfo.data.filter((x) => x._id !== contactInfoData._id);
            } else {
              // Update contactInfo
              const newContactInfo = { ...contactInfo, ...contactInfoData };
              user.resumes.data[r].contactInfo.data[c] = newContactInfo;
            }
            return true; // break the loop
          }
        });
        return true; // break the loop
      }
    });

    setUser(() => user);
  };
  const storeTemplate = (templateData) => {
    var user = getUser();

    user.resumes.data.forEach((resume, r) => {
      if (resume._id === editingResume._id) {
        const newTemplate = { ...resume.template, ...templateData };
        user.resumes.data[r].template = newTemplate;
        setEditingResume(user.resumes.data[r]);
      }
    });

    setUser(() => user);
  };
  const storeCategory = (categoryData, { add, del }) => {
    var user = getUser();

    user.resumes.data.some((resume, r) => {
      if (resume._id === editingResume._id) {
        if (add) {
          // Add category
          user.resumes.data[r].categories.data.push(categoryData);
          // setEditingCategory(categoryData);
          return true; // break the loop
        }
        resume.categories.data.some((category, c) => {
          if (category._id === categoryData._id) {
            if (del) {
              // Delete category
              user.resumes.data[r].categories.data = user.resumes.data[
                r
              ].categories.data.filter((x) => x._id !== categoryData._id);
            } else {
              // Update category
              const newCategory = { ...category, ...categoryData };
              user.resumes.data[r].categories.data[c] = newCategory;
              // setEditingCategory(newCategory);
            }
            return true; // break the loop
          }
        });
        return true; // break the loop
      }
    });

    setUser(() => user);
  };
  const getUser = () => {
    return user;
  };
  const clearUser = () => {
    // Get user away from dashboard
    if (Router.pathname.startsWith("/dashboard")) {
      Router.push("/login");
    }

    // Reset localstorage
    localStorage.removeItem("user");

    // Reset state
    setUser(null);
  };
  const userExists = () => {
    return !!user && user.username;
  };
  const moveItem = async (item, amount) => {
    if (moving) return false;
    setMoving(true);

    // Find item with priority p
    const p = item.priority + amount;
    var otherItem = getCategory(item.category._id).items.data.find(
      (item) => item.priority === p
    );

    // Update priority
    otherItem.priority -= amount;
    item.priority += amount;
    storeItem(otherItem, {});
    storeItem(item, {});

    resetPopups();

    // Send to fauna
    await updateItem(item._id, { priority: item.priority });
    await updateItem(otherItem._id, { priority: otherItem.priority });

    setMoving(false);
  };
  const moveCategory = async (category, amount) => {
    if (moving) return false;
    setMoving(true);

    // Find category with priority p
    const p = category.priority + amount;
    var otherCategory = editingResume.categories.data.find(
      (cat) => cat.priority === p
    );

    // Update priority
    var user = getUser();
    user.resumes.data
      .find((resume) => resume._id === editingResume._id)
      .categories.data.find(
        (cat) => cat._id === otherCategory._id
      ).priority += 1;
    user.resumes.data
      .find((resume) => resume._id === editingResume._id)
      .categories.data.find((cat) => cat._id === category._id).priority -= 1;

    resetPopups();

    // Send to fauna
    await updateCategory(category._id, { priority: category.priority });
    await updateCategory(otherCategory._id, {
      priority: otherCategory.priority,
    });

    setMoving(false);
  };
  const resetPopups = () => {
    setChangingInfo(false);
    setEditingContactInfo(-1);
    setEditingItem(-1);
    setEditingCategory(-1);
    setCreatingResume(-1);
    setWarning(false);
    setUserMadeChanges(false);
    setSelectedTemplateId(0);
  };
  useEffect(() => {
    if (user == null) {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser != null && localUser.secret != null) {
        storeUser(localUser);
        identity(localUser.secret).then(
          (data) => {
            // Database confirms that user is logged in!
            storeUser(localUser);
            setAuth(true);
            // Update user info
            readUser(localUser.id).then(
              (data) => {
                storeUser(data.findUserByID);
                console.log("readUser");
								console.table(data.findUserByID);
								forceRender();
              },
              (err) => {
                toast.error(`⚠️ ${err}`);
                console.error("Failed getting the user data", err);
              }
            );
          },
          (err) => {
            // Database denies that user is logged in!
            console.log("localUser:");
            console.table(localUser);
            console.warn("Your secret is fake news", err);
            toast.error(`⚠️ ${err}`);
            clearUser();
          }
        );
      } else {
        // There is no user data
        clearUser();
      }
    }

    // Set localstorage
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return (
    <UserContext.Provider
      value={{
        forceRender,
        storeUser,
        getUser,
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
        creatingResume,
        setCreatingResume,
        data,
        setData,
        error,
        setError,
        warning,
        setWarning,
        changingInfo,
        setChangingInfo,
        editingContactInfo,
        setEditingContactInfo,
        moveItem,
        moveCategory,
        storeItem,
        storeResume,
        storeTemplate,
        storeCategory,
        userMadeChanges,
        setUserMadeChanges,
        resetPopups,
        getCategory,
        selectedTemplateId,
        setSelectedTemplateId,
        getCategories,
        storeContactInfo,
        preview,
        setPreview,
        pdf,
        setPdf,
        loggingOut,
        setLoggingOut,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
