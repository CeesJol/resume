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
  const getText = () => {
    if (disabled && altText) {
      // If there is altText and the button is disabled (waiting for response),
      // show altText
      return altText;
    }
    return text;
  };
  const getTextualClassName = () => {
    const className = "resume--hoverable resume--action";
    if (textual === "large") return className + " resume--action--large";
    return className;
  };
  if (textual)
    return (
      <p
        disabled={disabled}
        onClick={handleClick}
        className={getTextualClassName()}
      >
        {getText()}
      </p>
    );
  return (
    <div className="button-container">
      {fn ? (
        <button onClick={handleClick} disabled={disabled} className={className}>
          {getText()}
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
