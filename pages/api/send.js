import jwt from "jsonwebtoken";
import Email from "../../emails/confirm";

const sgMail = require("@sendgrid/mail");

export const generateToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.EMAIL_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// Source
// https://vercel.com/guides/deploying-nextjs-nodejs-and-sendgrid-with-vercel
export const sendConfirmationEmail = async ({ id, email }) => {
  email = email.toLowerCase();

  const token = generateToken(id);
  const message = Email(token);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const content = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: `Confirm your account on Affilas`,
    text: message,
    html: `<p>${message}</p>`,
  };

  try {
    await sgMail.send(content);
    console.log("Message sent successfully.");
    return "Message sent successfully.";
  } catch (err) {
    console.error("send ERROR", err);
    return "Message not sent.";
  }
};

const send = async (req, res) => {
  const { type } = req.body;
  let result;
  switch (type) {
    case "SEND_CONFIRMATION_EMAIL":
      result = await sendConfirmationEmail(req.body);
      break;
    default:
      result = "Error: No such type in /api/send: " + type;
      console.log(result);
  }
  const json = JSON.stringify(result);
  res.end(json);
};

export default send;
