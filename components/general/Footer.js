import React from "react";

const Footer = () => (
  <footer className="footer">
    <div className="footer__content">
      © {new Date().getFullYear()} {process.env.APP_NAME}
    </div>
  </footer>
);

export default Footer;
