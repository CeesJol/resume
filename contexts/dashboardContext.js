import React, { createContext, useState, useEffect, useContext } from "react";
export const DashboardContext = createContext();
import { readUser, updateItemPriority } from "../pages/api/fauna";
import { UserContext } from "./userContext";

const DashboardContextProvider = (props) => {
  const { getUser } = useContext(UserContext);
  useEffect(() => {});
  const [nav, setNav] = useState(0); // 0 = main, 1 = settings
  const [editingItem, setEditingItem] = useState(-1);
  const [editingResume, setEditingResume] = useState(-1);
  const [data, setData] = useState(false);
	const [error, setError] = useState(false);
	const [warning, setWarning] = useState(false);
	const [changingInfo, setChangingInfo] = useState(false);
  const handleMutation = () => {
    // readUser();
    setEditingItem(-1);
  };
  const handleMove = (amount) => {
    // item.category.
    // updateItemPriority(item._id, item.priority - amount);
  };
  return (
    <DashboardContext.Provider
      value={{
        nav,
        setNav,
        editingItem,
        setEditingItem,
        editingResume,
        setEditingResume,
        data,
        setData,
        error,
				setError,
				warning,
				setWarning,
				changingInfo,
				setChangingInfo,
				handleMutation,
				handleMove
      }}
    >
      {props.children}
    </DashboardContext.Provider>
  );
};

export default DashboardContextProvider;
