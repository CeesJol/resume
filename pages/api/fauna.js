import executeQuery from "../../lib/executeQuery";
import stringifyObject from "../../lib/stringifyObject";
import { COOKIE_MAX_AGE } from "../../lib/constants";
import jwt from "jsonwebtoken";
import {
  validateSignup,
  validateLogin,
  validatePassword,
} from "../../lib/validate";

const RESUME_DATA = `_id
title
jobTitle
bio
priority
templateId
primaryColor
backgroundColor
data`;

// User data request data used by getUserByEmail and readUser
const USER_DATA = `_id
username
email
confirmed
jobTitle
bio
resumes {
	data {
		${RESUME_DATA}
	}
}`;

/** |----------------------------
 *  | USER
 *  |----------------------------
 */
export const loginUser = ({ email, password }) => {
  console.info("loginUser request");
  email = email.toLowerCase();
  const validationError = validateLogin(email, password);
  if (validationError) return [{ message: validationError }];
  return executeQuery(
    `mutation LoginUser {
			loginUser(email:"${email}", password: "${password}") {
				token
				user {
					${USER_DATA}
				}
			}
		}`,
    process.env.FAUNADB_SECRET_KEY
  );
};

export const logoutUser = (secret) => {
  console.info("logoutUser request");
  return executeQuery(
    `mutation LogoutUser {
			logoutUser
		}`,
    secret
  );
};

export const createUser = ({ email, username, password }) => {
  console.info("createUser request");
  email = email.toLowerCase();
  const validationError = validateSignup(email, username, password);
  if (validationError) return [{ message: validationError }];
  return executeQuery(
    `mutation CreateUser {
			createUser(email: "${email}", username: "${username}", password: "${password}") {
				_id
				username
				email
				jobTitle
				bio
				confirmed
			}
		}`,
    process.env.FAUNADB_SECRET_KEY
  );
};

export const updateUserPassword = ({ id, password }, secret) => {
  console.info("updateUserPassword request");
  const validationError = validatePassword(password);
  if (validationError) return [{ message: validationError }];
  return executeQuery(
    `mutation UpdateUserPassword {
			updateUserPassword(id: "${id}", password: "${password}") {
				_id
				username
				email
				jobTitle
				bio
				confirmed
			}
		}`,
    secret
  );
};

export const updateUserPasswordNoSecret = ({ token, password }) => {
  console.info("updateUserPasswordNoSecret request");
  try {
    const validationError = validatePassword(password);
    if (validationError) return [{ message: validationError }];
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const id = decoded.id;
    return executeQuery(
      `mutation UpdateUserPassword {
			updateUserPassword(id: "${id}", password: "${password}") {
				_id
				username
				email
				jobTitle
				bio
				confirmed
			}
		}`,
      process.env.FAUNADB_SECRET_KEY
    );
  } catch (err) {
    return [{ message: "Reset password error: " + err }];
  }
};

export const updateUser = async ({ id, data }, secret) => {
  console.info("updateUser request", id, data);
  if (data.email) data.email.toLowerCase();
  const { pairs, keys } = stringifyObject(data);
  return executeQuery(
    `mutation UpdateUser {
			updateUser(id: "${id}", data: {
				${pairs}
			}) {
				_id
				${keys}
			}
		}`,
    secret
  );
};

export const readUser = async ({ id }, secret) => {
  console.info("readUser request");
  return executeQuery(
    `query FindAUserByID {
			findUserByID(id: "${id}") {
				${USER_DATA}
			}
		}`,
    secret
  );
};

export const getUserByEmail = async ({ email }, secret) => {
  console.info("getUserByEmail request");
  email = email.toLowerCase();
  return executeQuery(
    `query FindAUserByEmail {
			userByEmail(email: "${email}") {
				${USER_DATA}
			}
		}`,
    secret
  );
};

export const confirmUser = async ({ token }, secret) => {
  console.info("confirmUser request");
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const id = decoded.id;
    return executeQuery(
      `mutation UpdateUser {
				updateUser(id: "${id}", data: {
					confirmed: true
				}) {
					confirmed
				}
			}`,
      secret
    );
  } catch (err) {
    return [{ message: "Confirm user error: " + err }];
  }
};

export const checkUserEmail = async ({ email }) => {
  console.info("checkUserEmail request");
  return executeQuery(
    `query {
			userByEmail(email: "${email}") {
				_id
				email
			}
		}`,
    process.env.FAUNADB_SECRET_KEY
  );
};

/** |----------------------------
 *  | RESUMES
 *  |----------------------------
 */
export const getResume = async ({ id }, secret) => {
  console.info("getResume request");
  return executeQuery(
    `query GetResume {
			findResumeByID(id: "${id}") {
				${RESUME_DATA}
			}
		}`,
    secret
  );
};

export const deleteResume = async ({ id }, secret) => {
  console.info("deleteResume request");
  return executeQuery(
    `mutation DeleteResume {
			deleteResume(id:"${id}") {
				_id
			}
		}`,
    secret
  );
};

export const createResume = async ({ userId, data }, secret) => {
  console.info("createResume request");
  const { pairs } = stringifyObject(data);

  const query = `mutation CreateResume {
		createResume(data: {
			${pairs}
			user: { connect: "${userId}" }
		}) {
			${RESUME_DATA}
		}
	}`;
  console.log("query:", query);
  return executeQuery(query, secret);
};

export const duplicateResume = async (
  { userId, resumeData, title, priority },
  secret
) => {
  console.info("duplicateResume request");
  const query = `mutation DuplicateResume {
		createResume(data: {
			title: "${title}"
			jobTitle: "${resumeData.jobTitle ? resumeData.jobTitle : ``}"
			bio: "${resumeData.bio ? resumeData.bio : ``}"
			templateId: "${resumeData.templateId}"
			priority: ${priority}
			primaryColor: "${resumeData.primaryColor}"
			backgroundColor: "${resumeData.backgroundColor}"
			data: "${data}"
			user: { connect: "${userId}" }
		}) {
			${RESUME_DATA}
		}
	}`;
  return executeQuery(query, secret);
};

export const updateResume = async ({ id, data }, secret) => {
  console.info("updateResume request");
  const { pairs, keys } = stringifyObject(data);
  return executeQuery(
    `mutation UpdateResume {
			updateResume(id: "${id}", data: {
				${pairs}
			}) {
				_id
				${keys}
			}
		}`,
    secret
  );
};

export const moveResume = async ({ id, amount }, secret) => {
  console.info("moveResume request");
  return executeQuery(
    `mutation MoveResume {
			moveResume(id: "${id}", amount: ${amount})
		}`,
    secret
  );
};

/** |----------------------------
 *  | FEEDBACK
 *  |----------------------------
 */
export const sendFeedback = async (
  { id, feedbackGrade, feedbackText },
  secret
) => {
  console.info("sendFeedback request");
  return executeQuery(
    `mutation CreateFeedback {
			createFeedback(data: {
				user: { connect: "${id}" }
				grade: ${feedbackGrade}
				text: """${feedbackText}"""
			}) {
				_id
			}
		}`,
    secret
  );
};

/** |----------------------------
 *  | MISC
 *  |----------------------------
 */
export const faultyQuery = async () => {
  console.info("faultyQuery request");
  // try {
  //   throw new Error("NO.");
  // } catch (err) {
  //   return [{ message: "Confirm user error: " + err }];
  // }

  return executeQuery(
    `query PlausibleError{
			plausibleError {
				_id
			}
		}`,
    process.env.FAUNADB_SECRET_KEY
  );
};

// Source
// https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name, cookies) {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const fauna = async (req, res) => {
  const deleteCookie = () => {
    // Delete secret cookie
    res.setHeader("Set-Cookie", [
      `secret=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    ]);
  };
  const userSecretEncrypted = getCookie("secret", req.headers.cookie);
  let userSecret;
  let result;
  if (userSecretEncrypted) {
    try {
      userSecret = jwt.verify(userSecretEncrypted, process.env.COOKIE_SECRET)
        .token;
    } catch (e) {
      console.error("Error: invalid authentication token: ", e);
      deleteCookie();
      result = [{ message: "Error: invalid authentication token" }];
      res.end(JSON.stringify(result));
      return;
    }
  }
  const { type } = req.body;

  try {
    switch (type) {
      // ----------
      // USERS
      // ----------
      case "LOGIN_USER":
        result = await loginUser(req.body);
        // If no validation error, set cookie
        if (!result[0]) {
          // Set secret cookie
          const encryptedToken = jwt.sign(
            {
              token: result.loginUser.token,
            },
            process.env.COOKIE_SECRET
          );
          res.setHeader("Set-Cookie", [
            `secret=${encryptedToken}; HttpOnly; Max-Age=${COOKIE_MAX_AGE}`,
          ]);
          // Don't send token to user
          result = result.loginUser.user;
        }
        break;
      case "LOGOUT_USER":
        result = await logoutUser(userSecret);
        deleteCookie();
        break;
      case "CREATE_USER":
        result = await createUser(req.body);
        break;
      case "UPDATE_USER_PASSWORD":
        result = await updateUserPassword(req.body, userSecret);
        break;
      case "UPDATE_USER_PASSWORD_NO_SECRET":
        result = await updateUserPasswordNoSecret(req.body);
        break;
      case "UPDATE_USER":
        result = await updateUser(req.body, userSecret);
        break;
      case "READ_USER":
        result = await readUser(req.body, userSecret);
        break;
      case "GET_USER_BY_EMAIL":
        result = await getUserByEmail(req.body, userSecret);
        break;
      case "CONFIRM_USER":
        result = await confirmUser(req.body, userSecret);
        break;
      case "CHECK_USER_EMAIL":
        result = await checkUserEmail(req.body);
        break;
      // ----------
      // RESUMES
      // ----------
      case "GET_RESUME":
        result = await getResume(req.body, userSecret);
        break;
      case "DELETE_RESUME":
        result = await deleteResume(req.body, userSecret);
        break;
      case "CREATE_RESUME":
        result = await createResume(req.body, userSecret);
        break;
      case "DUPLICATE_RESUME":
        result = await duplicateResume(req.body, userSecret);
        break;
      case "UPDATE_RESUME":
        result = await updateResume(req.body, userSecret);
        break;
      case "MOVE_RESUME":
        result = await moveResume(req.body, userSecret);
        break;
      // ----------
      // FEEDBACK
      // ----------
      case "SEND_FEEDBACK":
        result = await sendFeedback(req.body, userSecret);
        break;
      // ----------
      // MISC
      // ----------
      case "FAULTY_QUERY":
        result = await faultyQuery();
        break;
      default:
        result = [{ message: "Error: No such type in /api/fauna: " + type }];
    }
  } catch (e) {
    result = [{ message: e }];
  }
  res.end(JSON.stringify(result));
};

export default fauna;
