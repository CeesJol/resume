import React, { useState } from "react";
import Link from "next/link";

export default ({ text, fn, color }) => {
	const [disabled, setDisabled] = useState(false);
	const className = color == "red" ? "button button--red" : "button";
	const handleClick = async (event) => {
		if (event) event.preventDefault();
		if (!disabled) {
			setDisabled(true)
			console.log('set disabled.')
			await fn();
			setDisabled(false);
			console.log('set enabled.')
		}
	}
  return (
    <div className="button-container">
      {fn ? (
        <button onClick={handleClick} disabled={disabled} className={className}>
          <a>{text ? text : "Start now"}</a>
        </button>
      ) : (
        <Link href="/login">
          <button className={className}>
            <a>{text ? text : "Start now"}</a>
          </button>
        </Link>
      )}
    </div>
  );
};
