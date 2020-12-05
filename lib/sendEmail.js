const sgMail = require("@sendgrid/mail");

const logEmail = ({ to, from, subject, text }) => {
  console.info(
    `====================
NEW EMAIL
====================
TO: ${to}
FROM: ${from}
SUBJECT: ${subject}
TEXT: ${text}
====================`
  );
};

const sendEmail = async (content) => {
  if (process.env.NODE_ENV === "development") {
    logEmail(content);
  } else {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send(content);
  }
};

export default sendEmail;
