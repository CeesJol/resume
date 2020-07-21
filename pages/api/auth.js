import faunadb, { query as q } from "faunadb";
import { validateSignup, validateLogin } from "../../lib/validate";

const secret = process.env.FAUNADB_SECRET_KEY;
const server = new faunadb.Client({ secret });

/** |----------------------------
 *  | AUTHENTICATE
 *  |----------------------------
 */
export const login = async (email, password) => {
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
export const logout = async (secret) => {
  const client = new faunadb.Client({ secret });
  return client.query(q.Logout(false));
};

/** |----------------------------
 *  | CREATE ACCOUNT
 *  |----------------------------
 */
export const signup = async (email, username, password) => {
	email = email.toLowerCase();
	username = username.toLowerCase();
  const validationError = validateSignup(email, username, password);
  if (validationError) return Promise.reject(validationError);
  return server.query(
    q.Create(q.Collection("User"), {
      credentials: { password },
      data: {
        email,
        username,
        confirmed: false,
        website: "",
      },
    })
  );
};

/** |----------------------------
 *  | VALIDATE USER'S SECRET
 *  |----------------------------
 */
export const identity = async (secret) => {
  const client = new faunadb.Client({ secret });
  return client.query(q.Identity());
};

/** |----------------------------
 *  | UPDATE USER'S PASSWORD
 *  |----------------------------
 */
export const updatePassword = async (id, newPassword) => {
  return server.query(
    q.Update(q.Ref(q.Collection("User"), id), {
      credentials: { password: newPassword },
    })
  );
};
