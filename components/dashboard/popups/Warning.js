import React, { useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";

const Warning = () => {
  const { warning, setWarning, resetPopups } = useContext(UserContext);
  const handleYes = async () => {
    if (warning.fn) await warning.fn();
    resetPopups();
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

export default Warning;
