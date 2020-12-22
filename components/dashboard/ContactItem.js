import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { getContactIcon } from "../../lib/constants";

const ContactItem = ({ template, item, text, dummy, primaryColor }) => {
  const { setEditingContactInfo, preview, appendHoverToClassName } = useContext(
    UserContext
  );
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
  const getContactInfoClassName = () => {
    return appendHoverToClassName("resume__contact-info--item");
  };
  const getContactInfoBody = () => {
    const body = item.name ? item.name : text;
    if (item.link) {
      return (
        <a href={item.link} target="_blank" rel="noreferrer">
          {body}
        </a>
      );
    }
    return body;
  };
  return (
    <div
      onClick={() => handleChangeContactInfo(item)}
      className={getContactInfoClassName()}
    >
      {template.contactInfo === "TOP" ? (
        // Draw icon
        item.value ? (
          drawIcon(getContactIcon(item.name))
        ) : (
          drawIcon("plus-square")
        )
      ) : (
        // Draw text
        <h4 className="resume__contact-info--title">{item.value}</h4>
      )}
      <p className="resume__contact-info--body">{getContactInfoBody()}</p>
    </div>
  );
};

export default ContactItem;
