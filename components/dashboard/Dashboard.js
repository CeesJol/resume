import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import DashboardHeader from "./DashboardHeader";
import Add from "./Add";
import Edit from "./Edit";
import Item from "./Item";
import Items from "./Items";
import TopBox from "./TopBox";
import Settings from "./Settings";
import Nav from "./Nav";
import { UserContext } from "../../contexts/userContext";
import { DashboardContext } from "../../contexts/dashboardContext";

export default function Dashboard(props) {
  const { auth } = useContext(UserContext);
  const { nav, editingItem } = useContext(DashboardContext);
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
                    (editingItem !== -1 ? (
                      <>
                        <Edit />
                        <Item />
                      </>
                    ) : (
                      <>
                        <TopBox />
                        <Add />
                        <Items />
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
