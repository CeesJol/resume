import React from "react";

// import Image from "./image"
import Wave from "../general/Wave";
import Button from "../general/Button";

const Splash = () => (
  <>
    <div className="splash">
      <div className="splash__workable-content">
        <div className="splash__content">
          <div className="splash__left">
            <div>
              <h1 className="splash__content--title">
                Create a resume you’re proud of
              </h1>
              <p>
                Affilas allows you to build a custom resume in minutes.
              </p>
            </div>
            <footer>
              <Button />
            </footer>
          </div>
          <div className="splash__right">
            <img src="/images/undraw_order_confirmed_aaw7.svg" />
          </div>
        </div>
      </div>
    </div>
    <Wave />
  </>
);

export default Splash;
