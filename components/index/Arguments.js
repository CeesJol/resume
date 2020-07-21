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
            <h4>Set up a referral link</h4>
            <p>Set up the link anywhere and use it for your products.</p>
          </div>
          <div className="arguments__arg">
            <img src="../images/shop.svg" />
            <h4>Start an online store</h4>
            <p>
              Find products related to your niche and put them on your store.
            </p>
          </div>
          <div className="arguments__arg">
            <img src="../images/give-money.svg" />
            <h4>Generate revenue</h4>
            <p>
              When people buy from the merchant, you will get a referral fee for
              each purchase.
            </p>
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
