import React, { useState, useEffect, useContext } from "react";

import { UserContext } from "../../contexts/userContext";

export default function Nav(props) {
  const { nav, setNav, editingResume } = useContext(UserContext);
  return (
    <div className="dashboard__nav">
      <div className="dashboard__nav__content">
        <div
          className={
            "dashboard__nav--item " +
            (nav === 0 && " dashboard__nav--item-selected")
          }
          onClick={() => setNav(0)}
        >
          Editor
        </div>
        {editingResume !== -1 && (
          <>
            <div
              className={
                "dashboard__nav--item " +
                (nav === 1 && " dashboard__nav--item-selected")
              }
              onClick={() => setNav(1)}
            >
              Layout
            </div>
            <div
              className={
                "dashboard__nav--item " +
                (nav === 2 && " dashboard__nav--item-selected")
              }
              onClick={() => setNav(2)}
            >
              Preview
            </div>
          </>
        )}

        <div
          className={
            "dashboard__nav--item " +
            (nav === 3 && " dashboard__nav--item-selected")
          }
          onClick={() => setNav(3)}
        >
          Settings
        </div>
      </div>
    </div>
  );
}

// export default Nav();
