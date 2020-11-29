import React from "react";
import Button from "../general/Button";

const CTA = () => (
  <div className="container">
    <div className="cta">
      <div className="cta__content">
        <h3>Ready to try {process.env.APP_NAME}?</h3>
        <p>Set up a resume in 10 minutes.</p>
        <Button text="Get started for free" />
        {/* <p>Questions? <a href="mailto:contact@affilas.com">Contact us</a></p> */}
      </div>
    </div>
  </div>
);

export default CTA;
