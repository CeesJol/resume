import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Router from "next/router";
import { DUMMY_RESUME } from "../lib/constants";
import { fauna } from "../lib/api";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [dummy, setDummy] = useState(false);
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [nav, setNav] = useState(0);
  const [editingItem, setEditingItem] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingResume, setEditingResume] = useState(DUMMY_RESUME); // Most recently edited resume
  const [changingResume, setChangingResume] = useState(false); // Whether user is changing a resume
  const [creatingResume, setCreatingResume] = useState(false);
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  const [warning, setWarning] = useState(false);
  const [changingInfo, setChangingInfo] = useState(false);
  const [editingContactInfo, setEditingContactInfo] = useState(false);
  const [userMadeChanges, setUserMadeChanges] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [preview, setPreview] = useState(true);
  const [pdf, setPdf] = useState(null);
  const [loggingOut, setLoggingOut] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [status, setStatus] = useState(""); // Save status (saved / error)
  const [moving, setMoving] = useState(false);
  const storeStatus = (data, err) => {
    if (err) {
      toast.error(`⚠️ ${err}`);
      console.error("updateItem err:", err);
    }

    // Reset status
    if (data === "RESET") setStatus("Saved successfully after error.");

    // Dont update status if there is an error
    if (status.startsWith("Error")) return;

    setStatus(data);
  };
  const forceRender = () => {
    setDummy(!dummy);
  };
  const storeUser = (data) => {
    setUser((prevUser) => ({ ...prevUser, ...data }));
  };
  const getCategory = (categoryId) => {
    return editingResume.categories.data.find(
      (category) => category._id === categoryId
    );
  };
  const getResumes = () => {
    return userExists() && user.resumes.data;
  };
  const getContactInfo = (resume) => {
    if (resume) return resume.contactInfo.data;
    return editingResume.contactInfo.data;
  };
  const getCategories = (resume, sidebar) => {
    const cur = (resume || editingResume).categories.data;
    if (sidebar !== undefined)
      return cur.filter((cat) => cat.sidebar === sidebar);
    return cur;
  };
  const getItems = (category) => {
    return category && category.items && category.items.data;
  };
  const getJobTitle = (resume) => {
    if (resume) return resume.jobTitle || "Job Title";
    return editingResume.jobTitle || "Job Title";
  };
  const getBio = (resume) => {
    if (resume) return resume.bio || "Bio";
    return editingResume.bio || "Bio";
  };
  const storeResume = (resumeData, { add, del, newId }) => {
    storeStatus("Saving...");

    if (del) {
      // Delete resume
      user.resumes.data = user.resumes.data.filter(
        (x) => x._id !== resumeData._id
      );
      reset();
      setUser(() => user);
      resetPopups();
      return;
    } else if (add) {
      // Add resume
      user.resumes.data.push(resumeData);
      setUser(() => user);
      resetPopups();
      return;
    }

    user.resumes.data.forEach((resume, r) => {
      if (resume._id === resumeData._id) {
        if (newId) {
          user.resumes.data[r]._id = newId;
          setEditingResume(user.resumes.data[r]);
        } else {
          const newResume = { ...resume, ...resumeData };
          user.resumes.data[r] = newResume;
          setEditingResume(newResume);
        }
      }
    });

    resetPopups();

    setUser(() => user);
  };
  const storeCategory = (categoryData, { add, del, newId }) => {
    storeStatus("Saving...");

    const resume = user.resumes.data.find(
      (res) => res._id === editingResume._id
    );

    if (add) {
      // Add category
      resume.categories.data.push(categoryData);
    } else if (del) {
      // Delete category
      resume.categories.data = resume.categories.data.filter(
        (category) => category._id !== categoryData._id
      );
    } else {
      resume.categories.data.find((category, i) => {
        if (category._id === categoryData._id) {
          // Update category
          if (newId) {
            resume.categories.data[i]._id = newId;
          } else {
            const newCategory = { ...category, ...categoryData };
            resume.categories.data[i] = newCategory;
          }
        }
      });
    }

    resetPopups();
  };
  const storeItem = (itemData, { del, add, newId }) => {
    storeStatus("Saving...");

    const resume = user.resumes.data.find(
      (res) => res._id === editingResume._id
    );
    const category = resume.categories.data.find(
      (cat) => cat._id === itemData.category._id
    );

    if (add) {
      // Add item
      category.items.data.push(itemData);
    } else if (del) {
      // Delete item
      category.items.data = category.items.data.filter(
        (item) => item._id !== itemData._id
      );
    } else {
      category.items.data.find((item, i) => {
        if (item._id === itemData._id) {
          // Update item
          if (newId) {
            category.items.data[i]._id = newId;
          } else {
            const newItem = { ...item, ...itemData };
            category.items.data[i] = newItem;
          }
        }
      });
    }

    resetPopups();
  };
  const storeContactInfo = (contactInfoData, { add, del, newId }) => {
    storeStatus("Saving...");

    const resume = user.resumes.data.find(
      (res) => res._id === editingResume._id
    );

    if (add) {
      // Add contactInfo
      resume.contactInfo.data.push(contactInfoData);
    } else if (del) {
      // Delete contactInfo
      resume.contactInfo.data = resume.contactInfo.data.filter(
        (item) => item._id !== contactInfoData._id
      );
    } else {
      resume.contactInfo.data.find((item, i) => {
        if (item._id === contactInfoData._id) {
          // Update contactInfo
          if (newId) {
            resume.contactInfo.data[i]._id = newId;
          } else {
            const newItem = { ...item, ...contactInfoData };
            resume.contactInfo.data[i] = newItem;
          }
        }
      });
    }

    resetPopups();
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
    if (moving) return false;
    setMoving(true);

    // Send to fauna
    await fauna({
      type: "MOVE_ITEM",
      id: item._id,
      amount,
    }).then(
      () => {
        // Find item with priority p
        const p = item.priority + amount;
        let otherItem = getCategory(item.category._id).items.data.find(
          (item) => item.priority === p
        );

        // Update priority
        otherItem.priority -= amount;
        item.priority += amount;
        storeItem(otherItem, {});
        storeItem(item, {});

        resetPopups();
        storeStatus("Saved.");
      },
      (err) => {
        storeStatus(`Error: failed to save: ${err}`);
      }
    );

    setMoving(false);
  };
  const moveCategory = async (category, amount) => {
    if (moving) return false;
    setMoving(true);

    // Send to fauna
    await fauna({
      type: "MOVE_CATEGORY",
      id: category._id,
      amount,
    }).then(
      () => {
        // Find category (in same bar) with priority p
        const p = category.priority + amount;
        let otherCategory = editingResume.categories.data.find(
          (cat) => cat.priority === p && cat.sidebar === category.sidebar
        );

        // Update priority
        user.resumes.data
          .find((resume) => resume._id === editingResume._id)
          .categories.data.find(
            (cat) => cat._id === otherCategory._id
          ).priority -= amount;
        user.resumes.data
          .find((resume) => resume._id === editingResume._id)
          .categories.data.find(
            (cat) => cat._id === category._id
          ).priority += amount;

        resetPopups();
        storeStatus("Saved.");
      },
      (err) => {
        storeStatus(`Error: failed to save: ${err}`);
      }
    );

    setMoving(false);
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
        storeResume(otherResume, {});
        storeResume(resume, {});

        resetPopups();
        storeStatus("Saved.");
      },
      (err) => {
        storeStatus(`Error: failed to save: ${err}`);
      }
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
    setStatus("");
    resetPopups();
  };
  useEffect(() => {
    if (user == null) {
      const userId = JSON.parse(localStorage.getItem("userId"));
      if (userId != null) {
        fauna({ type: "READ_USER", id: userId }).then(
          (data) => {
            if (!data.findUserByID) {
              console.error("Unauthenticated. Data:", data);
              toast.error(`⚠️ Unauthenticated`);
              clearUser();
              return;
            }
            if (data.findUserByID.resumes.data[0]) {
              setEditingResume(data.findUserByID.resumes.data[0]);
            } else {
              setEditingResume(DUMMY_RESUME);
            }
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
      } else {
        // There is no user data
        console.info("No user data");
        clearUser();
      }
    }
  }, [user]);
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
        moveResume,
        storeItem,
        storeResume,
        storeCategory,
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
        storeContactInfo,
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
        setStatus,
        storeStatus,
        moving,
        setMoving,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
