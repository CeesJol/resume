import React, { useContext } from "react";
import DashboardHeader from "./DashboardHeader";
import Resumes from "./Resumes";
import Editor from "./Editor";
import Layout from "./Layout";
import Preview from "./Preview";
import Options from "./Options";
import Settings from "./Settings";
import Nav from "./Nav";
import { UserContext } from "../../contexts/userContext";
import Warning from "./popups/Warning";
import ResumePopup from "./popups/ResumePopup";
import Popup from "./popups/Popup";
import CategoryPopup from "./popups/CategoryPopup";
import UserPopup from "./popups/UserPopup";
import ContactPopup from "./popups/ContactPopup";
import LoadingPopup from "./popups/LoadingPopup";

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
	if (loggingOut) return <LoadingPopup text={`Logging out...`} />;
  if (!auth) return <LoadingPopup text={`Authenticating...`} />;
  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <main>
        <div className="dashboard">
          <Nav />
          <div className="dashboard__main">
            <div className="dashboard__main__content">
              {nav == 0 && (!changingResume ? <Resumes /> : <Editor />)}
              {nav == 1 && <Layout />}
              {nav == 2 && <Preview />}
							{nav == 3 && <Options />}
              {nav == 1000 && <Settings />}
            </div>
          </div>
        </div>
      </main>
      {/* Draw popups */}
      {creatingResume !== -1 && <ResumePopup />}
      {editingItem !== -1 && <Popup />}
      {editingCategory !== -1 && editingItem === -1 && <CategoryPopup />}
      {changingInfo && <UserPopup />}
      {editingContactInfo !== -1 && <ContactPopup />}
      {warning && <Warning />}
    </div>
  );
};

export default Dashboard;
