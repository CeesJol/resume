import React, { createContext, useState, useEffect, useContext } from "react";
export const DashboardContext = createContext();
import { readUser } from "../pages/api/fauna";
import { UserContext } from "./userContext";

const DashboardContextProvider = (props) => {
	const { getUser } = useContext(UserContext);
  useEffect(() => {

	});
	const [nav, setNav] = useState(0); // 0 = main, 1 = settings
	const [editingItem, setEditingItem] = useState(-1);
	const [data, setData] = useState(false);
	const [error, setError] = useState(false);
  function handleMutation() {
    // readUser();
    setEditingItem(-1);
  }
  return (
    <DashboardContext.Provider
      value={{
				nav, setNav,
				editingItem, setEditingItem,
				data, setData,
				error, setError,
				handleMutation
      }}
    >
      {props.children}
    </DashboardContext.Provider>
  );
};

export default DashboardContextProvider;
