import React, { useContext, useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Resumes from "./Resumes";
import Layout from "./nav/Layout";
import Editor from "./nav/Editor";
import Export from "./nav/Export";
import Options from "./nav/Options";
import Settings from "./nav/Settings";
import Nav from "./nav/Nav";
import { UserContext } from "../../contexts/userContext";
import Warning from "./popups/Warning";
import ResumePopup from "./popups/ResumePopup";
import ItemPopup from "./popups/ItemPopup";
import CategoryPopup from "./popups/CategoryPopup";
import UserPopup from "./popups/UserPopup";
import ContactPopup from "./popups/ContactPopup";
import LoadingPopup from "./popups/LoadingPopup";
import Feedback from "./Feedback";

const Dashboard = () => {
  const {
    auth,
    nav,
    editingItem,
    changingResume,
    warning,
    creatingResume,
    editingCategory,
    changingInfo,
    editingContactInfo,
    loggingOut,
  } = useContext(UserContext);
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onscroll = function () {
        setScroll(window.pageYOffset);
      };
    }
  }, []);
  if (loggingOut) return <LoadingPopup text={`Logging out...`} />;
  if (!auth) return <LoadingPopup text={`Authenticating...`} />;
  return (
    <div className="dashboard-container">
      <Feedback />
      <div
        style={{
          position: "sticky",
          top: "0",
          zIndex: "12",
          boxShadow: `0px -10px 
						${Math.min((20 * scroll) / 200, 20)}px  
						${Math.min((10 * scroll) / 200, 10)}px 
						rgba(0,0,0,0.15)`,
        }}
      >
        <DashboardHeader />
        <Nav />
      </div>
      <main>
        <div className="dashboard">
          <div className="dashboard__content">
            {nav == 0 && (!changingResume ? <Resumes /> : <Editor />)}
            {nav == 1 && <Layout />}
            {nav == 2 && <Export />}
            {nav == 3 && <Options />}
            {nav == 1000 && <Settings />}
          </div>
        </div>
      </main>
      {/* Draw popups */}
      {creatingResume && <ResumePopup />}
      {editingItem && <ItemPopup />}
      {editingCategory && !editingItem && <CategoryPopup />}
      {changingInfo && <UserPopup />}
      {editingContactInfo && <ContactPopup />}
      {warning && <Warning />}
    </div>
  );
};

export default Dashboard;
