import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import { DashboardContext } from "../../../contexts/dashboardContext";
import Button from "../../general/Button";

export default () => {
  const { getUser, storeUser } = useContext(UserContext);
  const { setEditingItem, setChangingInfo, warning, setWarning } = useContext(
    DashboardContext
  );
  const handleYes = async () => {
    if (warning.fn) await fn();
    setChangingInfo(false);
    setEditingItem(-1);
    setWarning(false);
  };
  const handleCancel = () => {
    setWarning(false);
  };
  return (
    <div className="popup-container">
      <div className="popup popup--medium">
        <h4>{warning.text}</h4>
        <form>
          <Button text="Yes" color="red" altText="Updating..." fn={handleYes} />
          <Button text="Cancel" altText="Updating..." fn={handleCancel} />
        </form>
      </div>
    </div>
  );
};
