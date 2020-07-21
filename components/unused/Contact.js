import React from "react"

import Wave from "../Wave"

const Contact = () => (
  <div className="container contact">
    <Wave reversed={true} />
    <div className="contact__content">
      <div className="contact__form">
        <h3 id="contact">Get in touch</h3>
        <form name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact" />
          <input type="text" name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <input type="tel" name="phone" placeholder="Phone number" />
          <textarea name="message" placeholder="Message"></textarea>
          <button type="submit" className="button">
            Send
          </button>
        </form>
      </div>
      <div className="contact__alt">
        <h4>Altneratives</h4>
        <p>
          Nulla laboris pariatur Lorem nulla reprehenderit{" "}
          <a href="mailto:john@example.com">john@example.com</a>.
        </p>
      </div>
    </div>
  </div>
)

export default Contact
