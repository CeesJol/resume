import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { contactpickerOptions } from "../../lib/constants";

const ContactItem = ({ item, txt }) => {
  const { setEditingContactInfo, preview, getLayoutItem } = useContext(UserContext);
  const handleChangeContactInfo = (item) => {
    if (preview) return false;
    setEditingContactInfo(item);
  };
  const drawIcon = (name) => (
    <i
      className={`fa fa-${name} resume__contact-info--icon`}
      style={{
        color: getLayoutItem("Primary Color"),
      }}
    ></i>
  );
  return (
    <div
      onClick={() => handleChangeContactInfo(item)}
      className={`resume__contact-info--item ${
        !preview ? "resume--hoverable" : ""
      }`}
    >
      {item.value
        ? contactpickerOptions[item.value] &&
          drawIcon(contactpickerOptions[item.value])
        : drawIcon("plus-square")}
      <p>{item.name ? item.name : txt}</p>
    </div>
  );
};

export default ContactItem;
