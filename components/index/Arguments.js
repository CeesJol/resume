import React from "react";

import Wave from "../general/Wave";
import Button from "../general/Button";

const Arguments = () => (
  <>
    <div className="container arguments">
      <div className="arguments__content">
        <h2>Take the best path forward</h2>
        <div className="arguments__args">
          <div className="arguments__arg">
            <img src="../images/monitor.svg" />
            <h4>Build your resume</h4>
            <p>Add work experience, education and others to your resume.</p>
          </div>
          <div className="arguments__arg">
            <img src="../images/shop.svg" />
            <h4>Pick a theme</h4>
            <p>Use our theme store to find a theme that suits you.</p>
          </div>
          <div className="arguments__arg">
            <img src="../images/give-money.svg" />
            <h4>Export to PDF</h4>
            <p>When you are done, export the resume to PDF.</p>
          </div>
        </div>
        <footer>
          <Button />
        </footer>
      </div>
    </div>
    <Wave />
  </>
);

export default Arguments;
