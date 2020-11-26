import jwt from "jsonwebtoken";
import ConfirmEmail from "../../lib/emails/confirm";
import ResetPasswordEmail from "../../lib/emails/reset-password";

const sgMail = require("@sendgrid/mail");

export const generateToken = (id, expiresIn) => {
  return jwt.sign(
    {
      id,
    },
    process.env.EMAIL_SECRET,
    {
      expiresIn,
    }
  );
};

// Source
// https://vercel.com/guides/deploying-nextjs-nodejs-and-sendgrid-with-vercel
export const sendConfirmationEmail = async ({ id, email }) => {
  email = email.toLowerCase();

  const token = generateToken(id, "30d");
  const message = ConfirmEmail(token);

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
    console.info("Message sent successfully.");
    return { message: "Message sent successfully." };
  } catch (err) {
    console.error("send ERROR", err);
    return [{ message: "Message not sent: " + err }];
  }
};

export const sendResetLink = async ({ id, email }) => {
  email = email.toLowerCase();

  const token = generateToken(id, "30m");
  const message = ResetPasswordEmail(token);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const content = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: `Reset your password`,
    text: message,
    html: `<p>${message}</p>`,
  };

  try {
    await sgMail.send(content);
    console.info("Message sent successfully.");
    return { message: "Message sent successfully." };
  } catch (err) {
    console.error("send ERROR", err);
    return [{ message: "Message not sent: " + err }];
  }
};

const send = async (req, res) => {
  const { type } = req.body;
  let result;
  switch (type) {
    case "SEND_CONFIRMATION_EMAIL":
      result = await sendConfirmationEmail(req.body);
      break;
    case "SEND_RESET_LINK":
      result = await sendResetLink(req.body);
      break;
    default:
      result = "Error: No such type in /api/send: " + type;
      console.error(result);
  }
  const json = JSON.stringify(result);
  res.end(json);
};

export default send;
