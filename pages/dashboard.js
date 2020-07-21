import React, { Component } from "react";
import Dashboard from "../components/dashboard/Dashboard";
import DashboardContextProvider from "../contexts/dashboardContext";

class DashboardPage extends Component {
  render() {
    return (
      <DashboardContextProvider>
        <Dashboard />
      </DashboardContextProvider>
    );
  }
}

export default DashboardPage;
