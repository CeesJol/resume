import executeQuery from "../../lib/executeQuery";
import stringifyObject from "../../lib/stringifyObject";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORIES_SIDEBAR_CUTOFF,
  SIDEBAR_INCREMENT,
} from "../../lib/constants";
import jwt from "jsonwebtoken";

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
layout {
	data {
		_id
		name
		value
	}
}
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
template {
	_id
	name
	style
	sidebar
}
categories {
	data {
		_id
		name
		type
		priority
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
export const updateUser = async ({ id, data }) => {
  console.log("updateUser request", id, data);
  if (data.email) data.email.toLowerCase();
  return executeQuery(`mutation UpdateUser {
		updateUser(id: "${id}", data: {
			${stringifyObject(data)}
		}) {
			username
			email
			jobTitle
			bio
			confirmed
		}
	}`);
};

export const readUser = async ({ id }) => {
  console.log("readUser request");
  return executeQuery(`query FindAUserByID {
		findUserByID(id: "${id}") {
			${USER_DATA}
		}
	}`);
};

export const getUserByEmail = async ({ email }) => {
  console.log("getUserByEmail request");
  email = email.toLowerCase();
  return executeQuery(`query FindAUserByEmail {
		userByEmail(email: "${email}") {
			${USER_DATA}
		}
	}`);
};

export const confirmUser = async ({ token }) => {
  console.log("confirmUser request");
  try {
    var decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const id = decoded.id;
    return executeQuery(`mutation UpdateUser {
			updateUser(id: "${id}", data: {
				confirmed: true
			}) {
				confirmed
			}
		}`);
  } catch (e) {
    throw new Error("Confirm user error", e);
  }
};

/** |----------------------------
 *  | RESUMES
 *  |----------------------------
 */
export const getResume = async ({ id }) => {
  console.log("getResume request");
  return executeQuery(`query GetResume {
		findResumeByID(id: "${id}") {
			${RESUME_DATA}
		}
	}`);
};

export const deleteResume = async ({ id }) => {
  console.log("deleteResume request");
  return executeQuery(`mutation DeleteResume {
		cascadeDeleteResume(id: "${id}")
	}`);
};

export const createResume = async ({ userId, templateId, data }) => {
  console.log("createResume request");
  var query = `mutation CreateResume {
		createResume(data: {
			${stringifyObject(data)}
			categories: {
				create: [
					${DEFAULT_CATEGORIES.map(
            (category, index) =>
              `{ 
							name: "${category.name}" 
							type: "${category.type}"
							priority: ${
                index +
                1 +
                (index >= DEFAULT_CATEGORIES_SIDEBAR_CUTOFF) * SIDEBAR_INCREMENT
              }
						}`
          )}
				]
			}
			layout: {
				create: [
					${data.layout.map(
            (item) => `{
						name: "${item.name}"
						value: "${item.value}"
					}`
          )}
				]
			}
			template: { connect: "${templateId}" }
			user: { connect: "${userId}" }
		}) {
			${RESUME_DATA}
		}
	}`;
  return executeQuery(query);
};

export const duplicateResume = async ({
  userId,
  resumeData,
  title,
  priority,
}) => {
  console.log("duplicateResume request");
  var query = `mutation DuplicateResume {
		createResume(data: {
			title: "${title}"
			jobTitle: "${resumeData.jobTitle ? resumeData.jobTitle : ``}"
			bio: "${resumeData.bio ? resumeData.bio : ``}"
			priority: ${priority}
			categories: {
				create: [
					${resumeData.categories.data.map(
            (category) =>
              `{ 
								${stringifyObject(category)}
								items: {
									create: [
										${category.items.data.map(
                      (item) => `{
												${stringifyObject(item)}
										}`
                    )}
								]
							}
						}`
          )}
				]
			}
			layout: {
				create: [
					${resumeData.layout.data.map(
            (layoutItem) => `{
							${stringifyObject(layoutItem)}
						}`
          )}
				]
			}
			contactInfo: {
				create: [
					${resumeData.contactInfo.data.map(
            (contactInfoItem) => `{
							${stringifyObject(contactInfoItem)}
						}`
          )}
				]
			}
			template: { connect: "${resumeData.template._id}" }
			user: { connect: "${userId}" }
		}) {
			${RESUME_DATA}
		}
	}`;
  return executeQuery(query);
};

export const updateResume = async ({ id, data }) => {
  console.log("updateResume request");
  return executeQuery(`mutation UpdateResume {
		updateResume(id: "${id}", data: {
			${stringifyObject(data)}
		}) {
			_id
			title
			jobTitle
			bio
		}
	}`);
};

export const moveResume = async ({ id, amount }) => {
  console.log("moveResume request");
  return executeQuery(`mutation MoveResume {
		moveResume(id: "${id}", amount: ${amount})
	}`);
};

export const updateResumeTemplate = async ({ id, templateId }) => {
  console.log("updateResumeTemplate request");
  return executeQuery(`mutation UpdateResumeTemplate {
		updateResume(id: "${id}", data: {
			template: { connect: "${templateId}" }
		}) {
			template {
				_id
			}
		}
	}`);
};

/** |----------------------------
 *  | CATEGORIES
 *  |----------------------------
 */
export const createCategory = async ({ resumeId, data }) => {
  console.log("createCategory request");
  return executeQuery(`mutation CreateCategory {
		createCategory(data: {
			${stringifyObject(data)}
			resume: { connect: "${resumeId}" }
		}) {
			_id
			name
			type
			priority
			items {
				data {
					_id
				}
			}
			resume {
				_id
			}
		}
	}`);
};

// export const createCategoryWithItem = async ({
//   resumeId,
//   categoryName,
//   data,
// }) => {
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
// 	}`);
// };

export const updateCategory = async ({ id, data }) => {
  console.log("updateCategory request");
  return executeQuery(`mutation UpdateCategory {
		updateCategory(id: "${id}", data: {
			${stringifyObject(data)}
		}) {
			_id
			name
			type
			priority
		}
	}`);
};

export const deleteCategory = async ({ id }) => {
  console.log("deleteCategory request");
  return executeQuery(`mutation DeleteCategory {
		cascadeDeleteCategory(id: "${id}")
	}`);
};

export const moveCategory = async ({ id, amount }) => {
  console.log("moveCategory request");
  return executeQuery(`mutation MoveCategory {
		moveCategory(id: "${id}", amount: ${amount})
	}`);
};

/** |----------------------------
 *  | ITEMS
 *  |----------------------------
 */
export const createItem = async ({ categoryId, data }) => {
  console.log("createItem request");
  return executeQuery(`mutation CreateItem {
		createItem(data: {
			${stringifyObject(data)}
			category: { connect: "${categoryId}" }
		}) {
			${ITEM_DATA}
		}
	}`);
};

export const updateItem = async ({ id, data }) => {
  console.log("updateItem request");
  return executeQuery(`mutation UpdateItem {
		updateItem(id: "${id}", data: {
			${stringifyObject(data)}
		}) {
			${ITEM_DATA}
		}
	}`);
};

export const deleteItem = async ({ id }) => {
  console.log("deleteItem request");
  return executeQuery(`mutation DeleteItem {
		cascadeDeleteItem(id: "${id}")
	}`);
};

export const moveItem = async ({ id, amount }) => {
  console.log("moveItem request");
  return executeQuery(`mutation MoveItem {
		moveItem(id: "${id}", amount: ${amount})
	}`);
};

/** |----------------------------
 *  | TEMPLATES
 *  |----------------------------
 */
export const getTemplates = () => {
  console.log("getTemplates request");
  return executeQuery(`query GetTemplates {
		templates {
			data {
				_id
				name
				style
				sidebar
			}
		}
	}`);
};

// export const updateTemplate = async ({ id, data }) => {
//   console.log("updateTemplate request");
//   return executeQuery(`mutation UpdateTemplate {
// 		updateTemplate(id: "${id}", data: {
// 			${stringifyObject(data)}
// 		}) {
// 			_id
// 			name
// 			style
// 		}
// 	}`);
// };

/** |----------------------------
 *  | CONTACT INFO
 *  |----------------------------
 */
export const createContactInfo = async ({ resumeId, data }) => {
  console.log("createContactInfo request");
  return executeQuery(`mutation UpdateContactInfo {
		createContactInfo(data: {
			${stringifyObject(data)}
			resume: { connect: "${resumeId}" }
		}) {
			_id
			name
			value
			priority
			resume {
				_id
			}
		}
	}`);
};

export const updateContactInfo = async ({ id, data }) => {
  console.log("updateContactInfo request");
  return executeQuery(`mutation UpdateContactInfo {
		updateContactInfo(id: "${id}", data: {
			${stringifyObject(data)}
		}) {
			_id
			name
			value
			priority
			resume {
				_id
			}
		}
	}`);
};

export const deleteContactInfo = async ({ id }) => {
  console.log("deleteContactInfo request");
  return executeQuery(`mutation DeleteContactInfo {
		cascadeDeleteContactInfo(id: "${id}")
	}`);
};

/** |----------------------------
 *  | LAYOUT
 *  |----------------------------
 */
export const updateLayout = async ({ id, data }) => {
  console.log("updateLayout request");
  return executeQuery(`mutation UpdateLayout {
		updateLayout(id: "${id}", data: {
			${stringifyObject(data)}
		}) {
			_id
			name
			value
		}
	}`);
};

const fauna = async (req, res) => {
  const { type } = req.body;
  let result;
  console.log(req.body);
  switch (type) {
    // ----------
    // USERS
    // ----------
    case "UPDATE_USER":
      result = await updateUser(req.body);
      break;
    case "READ_USER":
      result = await readUser(req.body);
      break;
    case "GET_USER_BY_EMAIL":
      result = await getUserByEmail(req.body);
      break;
    case "CONFIRM_USER":
      result = await confirmUser(req.body);
      break;
    // ----------
    // RESUMES
    // ----------
    case "GET_RESUME":
      result = await getResume(req.body);
      break;
    case "DELETE_RESUME":
      result = await deleteResume(req.body);
      break;
    case "CREATE_RESUME":
      result = await createResume(req.body);
      break;
    case "DUPLICATE_RESUME":
      result = await duplicateResume(req.body);
      break;
    case "UPDATE_RESUME":
      result = await updateResume(req.body);
      break;
    case "MOVE_RESUME":
      result = await moveResume(req.body);
      break;
    case "UPDATE_RESUME_TEMPLATE":
      result = await updateResumeTemplate(req.body);
      break;
    // ----------
    // CATEGORIES
    // ----------
    case "CREATE_CATEGORY":
      result = await createCategory(req.body);
      break;
    // case "CREATE_CATEGORY_WITH_ITEM":
    //   result = await createCategoryWithItem(req.body);
    //   break;
    case "UPDATE_CATEGORY":
      result = await updateCategory(req.body);
      break;
    case "DELETE_CATEGORY":
      result = await deleteCategory(req.body);
      break;
    case "MOVE_CATEGORY":
      result = await moveCategory(req.body);
      break;
    // ----------
    // ITEMS
    // ----------
    case "CREATE_ITEM":
      result = await createItem(req.body);
      break;
    case "UPDATE_ITEM":
      result = await updateItem(req.body);
      break;
    case "DELETE_ITEM":
      result = await deleteItem(req.body);
      break;
    case "MOVE_ITEM":
      result = await moveItem(req.body);
      break;
    // ----------
    // TEMPLATES
    // ----------
    case "GET_TEMPLATES":
      result = await getTemplates(req.body);
      break;
    // case "UPDATE_TEMPLATE":
    //   result = await updateTemplate(req.body);
    //   break;
    // CONTACT INFO
    case "CREATE_CONTACT_INFO":
      result = await createContactInfo(req.body);
      break;
    case "UPDATE_CONTACT_INFO":
      result = await updateContactInfo(req.body);
      break;
    case "DELETE_CONTACT_INFO":
      result = await deleteContactInfo(req.body);
      break;
    // ----------
    // LAYOUT
    // ----------
    case "UPDATE_LAYOUT":
      result = await updateLayout(req.body);
      break;
    default:
      result = "Error: No such type in /api/fauna: " + type;
      console.log(result);
  }
  res.end(JSON.stringify(result));
};

export default fauna;
