import faunadb, { query as q } from "faunadb";
import { validateSignup, validateLogin } from "../../lib/validate";

const secret = process.env.FAUNADB_SECRET_KEY;
const server = new faunadb.Client({ secret });

/** |----------------------------
 *  | AUTHENTICATE
 *  |----------------------------
 */
export const login = async ({ email, password }) => {
  console.log("login request");
  email = email.toLowerCase();
  const validationError = validateLogin(email, password);
  if (validationError) return Promise.reject(validationError);
  return server.query(
    q.Login(q.Match(q.Index("userByEmail"), email), {
      password,
    })
  );
};

/** |----------------------------
 *  | LOG OUT
 *  |----------------------------
 */
export const logout = async ({ secret }) => {
  console.log("logout request");
  const client = new faunadb.Client({ secret });
  return client.query(q.Logout(false));
};

/** |----------------------------
 *  | CREATE ACCOUNT
 *  |----------------------------
 */
export const signup = async ({ email, username, password }) => {
  console.log("signup request");
  email = email.toLowerCase();
  const validationError = validateSignup(email, username, password);
  if (validationError) return Promise.reject(validationError);
  return server.query(
    q.Create(q.Collection("User"), {
      credentials: { password },
      data: {
        email,
        username,
        confirmed: false,
        bio: "",
      },
    })
  );
};

/** |----------------------------
 *  | VALIDATE USER'S SECRET
 *  |----------------------------
 */
export const identity = async ({ secret }) => {
  console.log("identity request");
  const client = new faunadb.Client({ secret });
  return client.query(q.Identity());
};

/** |----------------------------
 *  | UPDATE USER'S PASSWORD
 *  |----------------------------
 */
export const updatePassword = async ({ id, newPassword }) => {
  console.log("update password request");
  return server.query(
    q.Update(q.Ref(q.Collection("User"), id), {
      credentials: { password: newPassword },
    })
  );
};

const auth = async (req, res) => {
  const { type } = req.body;
  let result;
  switch (type) {
    case "LOGIN":
      result = await login(req.body);
      break;
    case "LOGOUT":
      result = await logout(req.body);
      break;
    case "SIGNUP":
      result = await signup(req.body);
      break;
    case "IDENTITY":
      result = await identity(req.body);
      break;
    case "UPDATE_PASSWORD":
      result = await updatePassword(req.body);
      break;
    default:
      console.log("you goofed it up (/api/auth)");
  }
  const json = JSON.stringify(result);
  res.end(json);
};

export default auth;
