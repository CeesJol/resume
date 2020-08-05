import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { contactpickerOptions } from "../../lib/constants"

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
			{item.value && contactpickerOptions[item.value] && (
				<i className={`fa fa-${contactpickerOptions[item.value]} resume__contact-info--icon`}></i>
			)}
      <p>{item.name ? item.name : txt}</p>
    </div>
  );
};

export default ContactItem;
