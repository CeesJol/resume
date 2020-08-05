import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import DashboardHeader from "./DashboardHeader";
import Resumes from "./Resumes";
import Editor from "./Editor";
import Layout from "./Layout";
import Settings from "./Settings";
import Nav from "./Nav";
import { UserContext } from "../../contexts/userContext";
import Warning from "./popups/Warning";
import ResumePopup from "./popups/ResumePopup";
import Popup from "./popups/Popup";
import CategoryPopup from "./popups/CategoryPopup";
import UserPopup from "./popups/UserPopup";

export default function Dashboard(props) {
  const {
    auth,
    getUser,
    nav,
    editingItem,
    editingResume,
    warning,
    creatingResume,
    editingCategory,
    changingInfo,
  } = useContext(UserContext);
  useEffect(() => {
    if (!getUser()) {
      Router.push("/login");
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
                    (editingResume === -1 ? (
                      <>
                        <Resumes />
                      </>
                    ) : (
                      <>
                        <Editor />
                      </>
                    ))}
                  {nav == 1 && <Layout />}
                  {nav == 2 && <Settings />}
                </div>
              </div>
            </div>
          </main>
          {/* Draw popups */}
          {creatingResume !== -1 && <ResumePopup />}
          {editingItem !== -1 && <Popup />}
          {editingCategory !== -1 && editingItem === -1 && <CategoryPopup />}
          {changingInfo && <UserPopup />}
					{warning && <Warning />}
        </div>
      ) : (
        <div className="popup-container">
          <div className="popup popup--small">
            <p>Authenticating{getUser() && " " + getUser().username}...</p>
            <div className="loading-animation">
              <div className="loadingio-spinner-eclipse-osisb6eiupo">
                <div className="ldio-8w8am58tzjr">
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
