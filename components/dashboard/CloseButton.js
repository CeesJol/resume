import React from "react";

const CloseButton = ({ fn }) => {
  return <i onClick={fn} className={`fa fa-close popup__header--close`}></i>;
};

export default CloseButton;
