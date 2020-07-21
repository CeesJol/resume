import React, { createContext, useState, useEffect, useContext } from "react";
export const DashboardContext = createContext();
import { getUserProductsByEmail } from "../pages/api/fauna";
import { UserContext } from "./userContext";

const DashboardContextProvider = (props) => {
	const { getUser } = useContext(UserContext);
  useEffect(() => {

	});
	const [nav, setNav] = useState(0); // 0 = main, 1 = settings
	const [editingProduct, setEditingProduct] = useState(-1);
	const [data, setData] = useState(false);
	const [error, setError] = useState(false);
	function getProducts() {
    const user = getUser();
    console.log(`Req for ${user.email}`);
    getUserProductsByEmail(user.email).then(
      (data) => {
        setData(data);
      },
      (error) => {
        console.log("getproducts error", error);
        setError(error);
      }
    );
  }
  function handleMutation() {
    getProducts();
    setEditingProduct(-1);
  }
  return (
    <DashboardContext.Provider
      value={{
				nav, setNav,
				editingProduct, setEditingProduct,
				data, setData,
				error, setError,
				getProducts,
				handleMutation
      }}
    >
      {props.children}
    </DashboardContext.Provider>
  );
};

export default DashboardContextProvider;
