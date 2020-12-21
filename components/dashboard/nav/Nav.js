import React, { useContext } from "react";

import { UserContext } from "../../../contexts/userContext";

const Nav = () => {
  const { nav, setNav, changingResume } = useContext(UserContext);
  const navItems = ["Editor", "Layout", "Export", "Options"];
  if (!changingResume) return <></>;
  const navClassName = (i) => {
    let className = "dashboard__nav--item";
    if (nav === i) {
      className += " dashboard__nav--item-selected";
    }
    return className;
  };
  return (
    <div className="dashboard__nav">
      <div className="dashboard__nav__content">
        {navItems.map((navItem, i) => (
          <div
            className={navClassName(i)}
            onClick={() => setNav(i)}
            key={`nav-${i}`}
          >
            {navItem}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nav;
