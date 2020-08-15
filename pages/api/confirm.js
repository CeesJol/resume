import jwt from "jsonwebtoken";
import faunadb, { query as q } from "faunadb";
import Email from "../../emails/confirm";

const sgMail = require("@sendgrid/mail");

const secret = process.env.FAUNADB_SECRET_KEY;
const server = new faunadb.Client({ secret });

/** |----------------------------
 *  | CONFIRM USER'S EMAIL
 *  |----------------------------
 */
export const confirmUser = ({ token }) => {
  try {
    // Decode the token
    var decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const id = decoded.id;

    // If it went well, send info to database
    return server.query(
      q.Update(q.Ref(q.Collection("User"), `${id}`), {
        data: {
          confirmed: true,
        },
      })
    );
  } catch (e) {
    console.log("token verification error", e);
  }
};

/** |----------------------------
 *  | DISCONFIRM USER'S EMAIL
 *  |----------------------------
 */
export const disconfirmUser = ({ id }) => {
  return server.query(
    q.Update(q.Ref(q.Collection("User"), `${id}`), {
      data: {
        confirmed: false,
      },
    })
  );
};

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

const confirm = async (req, res) => {
  const { type } = req.body;
  let result;
  switch (type) {
    case "CONFIRM":
      result = await confirmUser(req.body);
      break;
    case "DISCONFIRM":
      result = await disconfirmUser(req.body);
      break;
    case "SEND_CONFIRMATION_EMAIL":
      result = await sendConfirmationEmail(req.body);
      break;
    default:
      result = "Error: No such type in /api/confirm: " + type;
      console.log(result);
  }
  const json = JSON.stringify(result);
  res.end(json);
};

export default confirm;
