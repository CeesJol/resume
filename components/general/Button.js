import React, { useState } from "react";
import Link from "next/link";

const Button = ({ text, altText, fn, color, textual }) => {
  const [disabled, setDisabled] = useState(false);
  const className = color === "red" ? "button button--red" : "button";
  const handleClick = async (event) => {
    if (event) event.preventDefault();
    if (!disabled) {
      setDisabled(true);
      await fn();
      setDisabled(false);
    }
  };
  if (textual)
    return (
      <p
        disabled={disabled}
        onClick={handleClick}
        className="resume--hoverable resume--action"
      >
        {disabled && altText ? altText : text}
      </p>
    );
  return (
    <div className="button-container">
      {fn ? (
        <button onClick={handleClick} disabled={disabled} className={className}>
          {disabled && altText ? altText : text}
        </button>
      ) : (
        <Link href="/signup">
          <button className={className}>{text ? text : "Start now"}</button>
        </Link>
      )}
    </div>
  );
};

export default Button;
