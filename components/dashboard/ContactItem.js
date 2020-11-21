import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { getContactIcon } from "../../lib/constants";
import { isMobile } from "react-device-detect";

const ContactItem = ({ template, item, text, dummy, primaryColor }) => {
  const { setEditingContactInfo, preview } = useContext(UserContext);
  const handleChangeContactInfo = (item) => {
    if (preview) return false;
    if (dummy) setEditingContactInfo({});
    else setEditingContactInfo(item);
  };
  const drawIcon = (name) => (
    <i
      className={`fa fa-${name} resume__contact-info--icon`}
      style={{
        color: primaryColor,
      }}
    ></i>
  );
  return (
    <div
      onClick={() => handleChangeContactInfo(item)}
      className={`resume__contact-info--item ${
        !preview && !isMobile ? "resume--hoverable" : ""
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
      <p className="resume__contact-info--body">
        {item.name ? item.name : text}
      </p>
    </div>
  );
};

export default ContactItem;
