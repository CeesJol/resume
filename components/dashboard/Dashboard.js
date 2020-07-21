import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import DashboardHeader from "./DashboardHeader";
import Add from "./Add";
import Edit from "./Edit";
import Product from "./Product";
import Products from "./Products";
import TopBox from "./TopBox";
import Settings from "./Settings";
import Nav from "./Nav";
import { UserContext } from "../../contexts/userContext";
import { DashboardContext } from "../../contexts/dashboardContext";
import { identity } from "../../pages/api/auth";

export default function Dashboard(props) {
  const [req, setReq] = useState(false);
  const { auth, setAuth, getUser, clearUser } = useContext(UserContext);
  const { nav, editingProduct, data, error, getProducts } = useContext(
    DashboardContext
  );

  useEffect(() => {
    const user = getUser();
    if (!auth && user && user.secret) {
      identity(user.secret).then(
        (data) => {
          console.log("id data", data);
          setAuth(true);
        },
        (err) => {
          console.log("id err", err);
          clearUser();
          Router.push("/login");
        }
      );
    }

    if (!req && user && user.email && !data && !error) {
      setReq(true);
      getProducts();
    }
  });
  return (
    <>
      {auth ? (
        <div className="dashboard-container">
          <DashboardHeader />
          <main>
            <div className="dashboard">
              <Nav />
              <div className="dashboard__main">
                <div className="dashboard__main__content">
                  {nav == 0 &&
                    (editingProduct !== -1 ? (
                      <>
                        <Edit />
                        <Product />
                      </>
                    ) : (
                      <>
                        <TopBox />
                        <Add />
                        <Products />
                      </>
                    ))}
                  {nav == 1 && <Settings />}
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <p>Authenticating...</p>
      )}
    </>
  );
}
