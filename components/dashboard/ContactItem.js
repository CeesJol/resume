import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { getContactIcon } from "../../lib/constants";

const ContactItem = ({ template, item, txt }) => {
  const { setEditingContactInfo, preview, getLayoutItem } = useContext(
    UserContext
  );
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
      {template.contactInfo === "TOP" ? (
        // Draw icon
        item.value ? (
          drawIcon(getContactIcon(item.value))
        ) : (
          drawIcon("plus-square")
        )
      ) : (
        // Draw text
        <h4 className="resume__contact-info--title">{item.value}</h4>
      )}
      <p>{item.name ? item.name : txt}</p>
    </div>
  );
};

export default ContactItem;
