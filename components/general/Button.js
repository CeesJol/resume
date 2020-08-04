import React, { useState } from "react";
import Link from "next/link";

export default ({ text, altText, fn, color }) => {
  const [disabled, setDisabled] = useState(false);
  const className = color == "red" ? "button button--red" : "button";
  const handleClick = async (event) => {
    if (event) event.preventDefault();
    if (!disabled) {
      setDisabled(true);
      await fn();
      setDisabled(false);
    }
  };
  return (
    <div className="button-container">
      {fn ? (
        <button onClick={handleClick} disabled={disabled} className={className}>
          <a>{(disabled && altText) ? altText : text}</a>
        </button>
      ) : (
        <Link href="/signup">
          <button className={className}>
            <a>{text ? text : "Start now"}</a>
          </button>
        </Link>
      )}
    </div>
  );
};
