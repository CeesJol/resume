import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const ContactItem = ({ item, txt }) => {
  const { setEditingContactInfo } = useContext(UserContext);
  const handleChangeContactInfo = (item) => {
    setEditingContactInfo(item);
  };
  return (
    <div
      key={`${item.name}-${item.value}`}
      onClick={() => handleChangeContactInfo(item)}
      className="resume__contact-info--item"
    >
      <p>{item.name ? item.name : txt}</p>
    </div>
  );
};

export default ContactItem;
