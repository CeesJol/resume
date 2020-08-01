import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";

export default () => {
  const {
    getUser,
    storeUser,
    setEditingItem,
    setChangingInfo,
    warning,
    setWarning,
  } = useContext(UserContext);
  const handleYes = async () => {
    if (warning.fn) await warning.fn();
    setChangingInfo(false);
    setEditingItem(-1);
    setWarning(false);
  };
  const handleCancel = () => {
    setWarning(false);
  };
  return (
    <div className="popup-container" onClick={handleCancel}>
      <div className="popup popup--medium" onClick={(e) => e.stopPropagation()}>
        <p>
          <b>{warning.text}</b>
        </p>
        <form>
          <Button text="Yes" fn={handleYes} />
          <Button text="Cancel" color="red" fn={handleCancel} />
        </form>
      </div>
    </div>
  );
};
