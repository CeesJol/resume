import React, { useContext } from "react";
import { UserContext } from "../../../contexts/userContext";
import Button from "../../general/Button";
import ReactModal from "react-modal";
ReactModal.setAppElement("#__next");

const Warning = () => {
  const {
    warning,
    setWarning,
    resetPopups,
    storeStatusSuccess,
    storeStatusSaving,
  } = useContext(UserContext);
  const handleYes = async () => {
    if (warning.fn) {
      try {
        storeStatusSaving();
        await warning.fn();
        storeStatusSuccess();
      } catch (e) {
        storeStatusError(e);
      }
      resetPopups();
    } else {
      storeStatusSuccess();
      resetPopups();
    }
  };
  const handleCancel = () => {
    setWarning(false);
  };
  return (
    <ReactModal
      className="popup popup--medium"
      isOpen={true}
      overlayClassName="popup-container"
      onRequestClose={handleCancel}
    >
      <p>
        <b>{warning.text}</b>
      </p>
      <form>
        <Button text="Yes" fn={handleYes} />
        <Button text="Cancel" color="red" fn={handleCancel} />
      </form>
    </ReactModal>
  );
};

export default Warning;
