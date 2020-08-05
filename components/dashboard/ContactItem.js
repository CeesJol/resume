import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
// var FA = require('react-fontawesome')

const ContactItem = ({ item, txt }) => {
  const { setEditingContactInfo } = useContext(UserContext);
  const handleChangeContactInfo = (item) => {
    setEditingContactInfo(item);
  };
  return (
    <div
      onClick={() => handleChangeContactInfo(item)}
      className="resume__contact-info--item"
    >
			<i className="fa fa-rocket resume__contact-info--icon"></i>
      <p>{item.name ? item.name : txt}</p>
    </div>
  );
};

export default ContactItem;
