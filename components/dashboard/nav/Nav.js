import React, { useContext, useEffect, useState } from "react";

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
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onscroll = function () {
        setScroll(window.pageYOffset);
      };
    }
  }, []);

  return (
    <div
      className="dashboard__nav"
      style={{
        boxShadow: `0px -10px
          ${Math.min((20 * scroll) / 200, 20)}px
          ${Math.min((10 * scroll) / 200, 10)}px
          rgba(0,0,0,0.15)`,
      }}
    >
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
