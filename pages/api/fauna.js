import executeQuery from "../../lib/executeQuery";
import stringifyObject from "../../lib/stringifyObject";
import {
  DEFAULT_CATEGORIES,
  COOKIE_MAX_AGE,
  convertToTemplate,
} from "../../lib/constants";
import jwt from "jsonwebtoken";
import {
  validateSignup,
  validateLogin,
  validatePassword,
} from "../../lib/validate";
import { getTemplate } from "../../templates/templates";

const ITEM_DATA = `_id
title
location
month1
year1
month2
year2
value
description
priority
category {
	_id
}`;

const RESUME_DATA = `_id
title
jobTitle
bio
priority
templateId
primaryColor
backgroundColor
contactInfo {
	data {
		_id
		name
		value
		priority
		resume {
			_id
		}
	}
}
categories {
	data {
		_id
		name
		type
		priority
		sidebar
		items {
			data {
				${ITEM_DATA}
			}
		}
	}
}`;

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
  console.log("loginUser request");
  email = email.toLowerCase();
  const validationError = validateLogin(email, password);
  if (validationError) return Promise.reject(validationError);
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
  console.log("logoutUser request");
  return executeQuery(
    `mutation LogoutUser {
			logoutUser
		}`,
    secret
  );
};

export const createUser = ({ email, username, password }) => {
  console.log("createUser request");
  email = email.toLowerCase();
  const validationError = validateSignup(email, username, password);
  if (validationError) return Promise.reject(validationError);
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
  console.log("updateUserPassword request");
  const validationError = validatePassword(password);
  if (validationError) return Promise.reject(validationError);
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

export const updateUser = async ({ id, data }, secret) => {
  console.log("updateUser request", id, data);
  if (data.email) data.email.toLowerCase();
  const { pairs, keys } = stringifyObject(data);
  console.log("pairs, keys:", pairs, keys);
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
  console.log("readUser request");
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
  console.log("getUserByEmail request");
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
  console.log("confirmUser request");
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
    return [{ message: "Confirm user error:" + err }];
  }
};

/** |----------------------------
 *  | RESUMES
 *  |----------------------------
 */
export const getResume = async ({ id }, secret) => {
  console.log("getResume request");
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
  console.log("deleteResume request");
  return executeQuery(
    `mutation DeleteResume {
			cascadeDeleteResume(id: "${id}")
		}`,
    secret
  );
};

export const createResume = async ({ userId, data }, secret) => {
  console.log("createResume request");
  const { pairs } = stringifyObject(data);

  // Set whether to show value depending on resume property
  const template = getTemplate(data.templateId);
  const categories = convertToTemplate(DEFAULT_CATEGORIES, template);

  var query = `mutation CreateResume {
		createResume(data: {
			${pairs}
			categories: {
				create: [
					${categories.map(
            (category) => `{ 
							name: "${category.name}" 
							type: "${category.type}"
							sidebar: ${category.sidebar}
							priority: ${category.priority}
						}`
          )}
				]
			}
			user: { connect: "${userId}" }
		}) {
			${RESUME_DATA}
		}
	}`;
  return executeQuery(query, secret);
};

export const duplicateResume = async (
  { userId, resumeData, title, priority },
  secret
) => {
  console.log("duplicateResume request");
  var query = `mutation DuplicateResume {
		createResume(data: {
			title: "${title}"
			jobTitle: "${resumeData.jobTitle ? resumeData.jobTitle : ``}"
			bio: "${resumeData.bio ? resumeData.bio : ``}"
			templateId: "${resumeData.templateId}"
			priority: ${priority}
			categories: {
				create: [
					${resumeData.categories.data.map(
            (category) =>
              `{ 
								${stringifyObject(category).pairs}
								items: {
									create: [
										${category.items.data.map(
                      (item) => `{
												${stringifyObject(item).pairs}
										}`
                    )}
								]
							}
						}`
          )}
				]
			}
			primaryColor: "",
			backgroundColor: "",
			contactInfo: {
				create: [
					${resumeData.contactInfo.data.map(
            (contactInfoItem) => `{
							${stringifyObject(contactInfoItem).pairs}
						}`
          )}
				]
			}
			user: { connect: "${userId}" }
		}) {
			${RESUME_DATA}
		}
	}`;
  console.log("query:", query);
  return executeQuery(query, secret);
};

export const updateResume = async ({ id, data }, secret) => {
  console.log("updateResume request");
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
  console.log("moveResume request");
  return executeQuery(
    `mutation MoveResume {
			moveResume(id: "${id}", amount: ${amount})
		}`,
    secret
  );
};

// export const updateResumeTemplate = async ({ id, templateId }, secret) => {
//   console.log("updateResumeTemplate request");
//   return executeQuery(`mutation UpdateResumeTemplate {
// 		updateResume(id: "${id}", data: {
// 			template: { connect: "${templateId}" }
// 		}) {
// 			template {
// 				_id
// 			}
// 		}
// 	}`, secret);
// };

/** |----------------------------
 *  | CATEGORIES
 *  |----------------------------
 */
export const createCategory = async ({ resumeId, data }, secret) => {
  console.log("createCategory request");
  const { pairs, keys } = stringifyObject(data);
  return executeQuery(
    `mutation CreateCategory {
			createCategory(data: {
				${pairs}
				resume: { connect: "${resumeId}" }
			}) {
				items {
					data {
						_id
					}
				}
				resume {
					_id
				}
				_id
				${keys}
			}
		}`,
    secret
  );
};

// export const createCategoryWithItem = async ({
//   resumeId,
//   categoryName,
//   data,
// }, secret) => {
//   console.log("createCategoryWithItem request");
//   return executeQuery(`mutation CreateCategoryWithItem {
// 		createCategory(data: {
// 			name: "${categoryName}"
// 			resume: { connect: "${resumeId}" },
// 			items: {
// 				create: [
// 					{
// 						title: "${data.title}"
// 						location: "${data.location}"
// 						from: "${data.from}"
// 						to: "${data.to}"
// 						description: """${data.description}"""
// 					}
// 				]
// 			}
// 		}) {
// 			_id
// 			name
// 			items {
// 				data {
// 					_id
// 					title
// 					location
// 					from
// 					to
// 					description
// 				}
// 			}
// 		}
// 	}`, secret);
// };

export const updateCategory = async ({ id, data }, secret) => {
  console.log("updateCategory request");
  const { pairs, keys } = stringifyObject(data);
  return executeQuery(
    `mutation UpdateCategory {
			updateCategory(id: "${id}", data: {
				${pairs}
			}) {
				_id
				${keys}
			}
		}`,
    secret
  );
};

export const deleteCategory = async ({ id }, secret) => {
  console.log("deleteCategory request");
  return executeQuery(
    `mutation DeleteCategory {
			cascadeDeleteCategory(id: "${id}")
		}`,
    secret
  );
};

export const moveCategory = async ({ id, amount }, secret) => {
  console.log("moveCategory request");
  return executeQuery(
    `mutation MoveCategory {
			moveCategory(id: "${id}", amount: ${amount})
		}`,
    secret
  );
};

/** |----------------------------
 *  | ITEMS
 *  |----------------------------
 */
export const createItem = async ({ categoryId, data }, secret) => {
  console.log("createItem request");
  const { pairs, keys } = stringifyObject(data);
  console.log("{ pairs, keys }:", pairs, keys);

  return executeQuery(
    `mutation CreateItem {
			createItem(data: {
				${pairs}
				category: { connect: "${categoryId}" }
			}) {
				_id
				category {
					_id
				}
				${keys}
			}
		}`,
    secret
  );
};

export const updateItem = async ({ id, data }, secret) => {
  console.log("updateItem request");
  const { pairs, keys } = stringifyObject(data);
  return executeQuery(
    `mutation UpdateItem {
			updateItem(id: "${id}", data: {
				${pairs}
			}) {
				_id
				${keys}
			}
		}`,
    secret
  );
};

export const deleteItem = async ({ id }, secret) => {
  console.log("deleteItem request");
  return executeQuery(
    `mutation DeleteItem {
			cascadeDeleteItem(id: "${id}")
		}`,
    secret
  );
};

export const moveItem = async ({ id, amount }, secret) => {
  console.log("moveItem request");
  return executeQuery(
    `mutation MoveItem {
			moveItem(id: "${id}", amount: ${amount})
		}`,
    secret
  );
};

/** |----------------------------
 *  | TEMPLATES
 *  |----------------------------
 */
// export const getTemplates = () => {
//   console.log("getTemplates request");
//   return executeQuery(`query GetTemplates {
// 		templates {
// 			data {
// 				_id
// 				name
// 				style
// 				sidebar
// 			}
// 		}
// 	}`, secret);
// };

// export const updateTemplate = async ({ id, data }, secret) => {
//   console.log("updateTemplate request");
//   return executeQuery(`mutation UpdateTemplate {
// 		updateTemplate(id: "${id}", data: {
// 			${stringifyObject(data)}
// 		}) {
// 			_id
// 			name
// 			style
// 		}
// 	}`, secret);
// };

/** |----------------------------
 *  | CONTACT INFO
 *  |----------------------------
 */
export const createContactInfo = async ({ resumeId, data }, secret) => {
  console.log("createContactInfo request");
  const { pairs, keys } = stringifyObject(data);
  return executeQuery(
    `mutation UpdateContactInfo {
			createContactInfo(data: {
				${pairs}
				resume: { connect: "${resumeId}" }
			}) {
				_id
				${keys}
			}
		}`,
    secret
  );
};

export const updateContactInfo = async ({ id, data }, secret) => {
  console.log("updateContactInfo request");
  const { pairs, keys } = stringifyObject(data);
  return executeQuery(
    `mutation UpdateContactInfo {
			updateContactInfo(id: "${id}", data: {
				${pairs}
			}) {
				resume {
					_id
				}
				_id
				${keys}
			}
		}`,
    secret
  );
};

export const deleteContactInfo = async ({ id }, secret) => {
  console.log("deleteContactInfo request");
  return executeQuery(
    `mutation DeleteContactInfo {
			cascadeDeleteContactInfo(id: "${id}")
		}`,
    secret
  );
};

export const faultyQuery = async () => {
  console.log("faultyQuery request");
  // try {
  //   throw new Error("NO.");
  // } catch (err) {
  //   return [{ message: "Confirm user error:" + err }];
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
  const userSecret = getCookie("secret", req.headers.cookie);
  const { type } = req.body;
  let result;

  try {
    switch (type) {
      // ----------
      // USERS
      // ----------
      case "LOGIN_USER":
        result = await loginUser(req.body);
        // Set secret cookie
        res.setHeader("Set-Cookie", [
          `secret=${result.loginUser.token}; HttpOnly; Max-Age=${COOKIE_MAX_AGE}`,
        ]);
        break;
      case "LOGOUT_USER":
        result = await logoutUser(userSecret);
        // Delete secret cookie
        res.setHeader("Set-Cookie", [
          `secret=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        ]);
        break;
      case "CREATE_USER":
        result = await createUser(req.body);
        break;
      case "UPDATE_USER_PASSWORD":
        result = await updateUserPassword(req.body, userSecret);
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
      // case "UPDATE_RESUME_TEMPLATE":
      //   result = await updateResumeTemplate(req.body, userSecret);
      //   break;
      // ----------
      // CATEGORIES
      // ----------
      case "CREATE_CATEGORY":
        result = await createCategory(req.body, userSecret);
        break;
      // case "CREATE_CATEGORY_WITH_ITEM":
      //   result = await createCategoryWithItem(req.body, userSecret);
      //   break;
      case "UPDATE_CATEGORY":
        result = await updateCategory(req.body, userSecret);
        break;
      case "DELETE_CATEGORY":
        result = await deleteCategory(req.body, userSecret);
        break;
      case "MOVE_CATEGORY":
        result = await moveCategory(req.body, userSecret);
        break;
      // ----------
      // ITEMS
      // ----------
      case "CREATE_ITEM":
        result = await createItem(req.body, userSecret);
        break;
      case "UPDATE_ITEM":
        result = await updateItem(req.body, userSecret);
        break;
      case "DELETE_ITEM":
        result = await deleteItem(req.body, userSecret);
        break;
      case "MOVE_ITEM":
        result = await moveItem(req.body, userSecret);
        break;
      // ----------
      // TEMPLATES
      // ----------
      // case "GET_TEMPLATES":
      //   result = await getTemplates(req.body, userSecret);
      //   break;
      // case "UPDATE_TEMPLATE":
      //   result = await updateTemplate(req.body, userSecret);
      //   break;
      // CONTACT INFO
      case "CREATE_CONTACT_INFO":
        result = await createContactInfo(req.body, userSecret);
        break;
      case "UPDATE_CONTACT_INFO":
        result = await updateContactInfo(req.body, userSecret);
        break;
      case "DELETE_CONTACT_INFO":
        result = await deleteContactInfo(req.body, userSecret);
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
    result = e;
  }
  res.end(JSON.stringify(result));
};

export default fauna;
