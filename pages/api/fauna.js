import executeQuery from "../../lib/executeQuery";
import stringifyObject from "../../lib/stringifyObject";
import { defaultCategories } from "../../lib/constants";

// User data request data used by getUserByEmail and readUser
const userData = `username
email
confirmed
bio
resumes {
	data {
		_id
		title
		jobTitle
		bio
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
		}
		categories {
			data {
				_id
				name
				priority
				items {
					data {
						_id
						title
						location
						from
						to
						description
						priority
						category {
							_id
						}
					}
				}
			}
		}
	}
}`;

export const getResume = async (resumeId) => {
	console.log('getResume request');
  return executeQuery(`query GetResume {
		findResumeByID(id: "${resumeId}") {
			_id
			title
			jobTitle
			bio
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
			}
			categories {
				data {
					_id
					name
					priority
					items {
						data {
							_id
							title
							location
							from
							to
							description
							priority
							category {
								_id
							}
						}
					}
				}
			}
		}
	}`);
};

/** |----------------------------
 *  | GET USERNAME BY EMAIL
 *  |----------------------------
 */
export const getUserByEmail = async (email) => {
  console.log("getUserByEmail request");
  email = email.toLowerCase();
  return executeQuery(`query FindAUserByEmail {
		userByEmail(email: "${email}") {
			${userData}
		}
	}`);
};

/** |----------------------------
 *  | CREATE ITEM
 *  |----------------------------
 */
export const createItem = async (categoryId, data) => {
  console.log("createItem request");
  return executeQuery(`mutation CreateItem {
		createItem(data: {
			title: "${data.title}"
			location: "${data.location}"
			from: "${data.from}"
			to: "${data.to}"
			description: """${data.description}"""
			priority: ${data.priority}
			category: { connect: "${categoryId}" }
		}) {
			_id
			title
			location
			from
			to
			description
			priority
			category {
				_id
			}
		}
	}`);
};

/** |----------------------------
 *  | CREATE CATEGORY
 *  |----------------------------
 */
export const createCategory = async (resumeId, data) => {
  console.log("createCategory request");
  return executeQuery(`mutation CreateCategory {
		createCategory(data: {
			${stringifyObject(data)}
			resume: { connect: "${resumeId}" }
		}) {
			_id
			name
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

/** |----------------------------
 *  | CREATE CATEGORY WITH ITEM
 *  |----------------------------
 */
export const createCategoryWithItem = async (resumeId, categoryName, data) => {
  console.log("createCategoryWithItem request");
  return executeQuery(`mutation CreateCategoryWithItem {
		createCategory(data: {
			name: "${categoryName}"
			resume: { connect: "${resumeId}" },
			items: {
				create: [
					{ 
						title: "${data.title}"
						location: "${data.location}"
						from: "${data.from}"
						to: "${data.to}"
						description: """${data.description}"""
					}
				]
			}
		}) {
			_id
			name
			items {
				data {
					_id
					title
					location
					from
					to
					description
				}
			}
		}
	}`);
};

/** |----------------------------
 *  | CREATE RESUME
 *  |----------------------------
 */
export const createResume = async (userId, templateId, data) => {
  console.log("createResume request");
  var query = `mutation CreateResume {
		createResume(data: {
			${stringifyObject(data)}
			categories: {
				create: [
					${defaultCategories.map(
            (category, index) =>
              `{ 
							name: "${category}" 
							priority: ${index + 1}
						}`
          )}
				]
			}
			template: { connect: "${templateId}" }
			user: { connect: "${userId}" }
		}) {
			_id
			title
			categories {
				data {
					_id
					name
					priority
				}
			}
			user {
				_id
			}
			template {
				_id
				name
				style
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
		}
	}`;
  return executeQuery(query);
};

/** |----------------------------
 *  | GET TEMPLATES
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
			}
		}
	}`);
};

/** |----------------------------
 *  | UPDATE RESUME
 *  |----------------------------
 */
export const updateResume = async (resumeId, data) => {
  console.log("updateResume request");
  return executeQuery(`mutation UpdateResume {
		updateResume(id: "${resumeId}", data: {
			${stringifyObject(data)}
		}) {
			_id
			title
			jobTitle
			bio
		}
	}`);
};

/** |----------------------------
 *  | CREATE CONTACT INFO
 *  |----------------------------
 */
export const createContactInfo = async (resumeId, data) => {
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

/** |----------------------------
 *  | UPDATE CONTACT INFO
 *  |----------------------------
 */
export const updateContactInfo = async (contactInfoId, data) => {
  console.log("updateContactInfo request");
  return executeQuery(`mutation UpdateContactInfo {
		updateContactInfo(id: "${contactInfoId}", data: {
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

/** |----------------------------
 *  | DELETE CONTACT INFO
 *  |----------------------------
 */
export const deleteContactInfo = async (id) => {
  console.log("deleteContactInfo request");
  return executeQuery(`mutation DeleteContactInfo {
		deleteContactInfo(id: "${id}") {
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

/** |----------------------------
 *  | UPDATE ITEM
 *  |----------------------------
 */
export const updateItem = async (itemId, data) => {
  console.log("updateItem request");
  return executeQuery(`mutation UpdateItem {
		updateItem(id: "${itemId}", data: {
			${stringifyObject(data)}
		}) {
			_id
			title
			location
			from
			to
			description
			category {
				_id
			}
		}
	}`);
};

/** |----------------------------
 *  | UPDATE CATEGORY
 *  |----------------------------
 */
export const updateCategory = async (categoryId, data) => {
  console.log("updateCategory request");
  return executeQuery(`mutation UpdateCategory {
		updateCategory(id: "${categoryId}", data: {
			${stringifyObject(data)}
		}) {
			_id
			name
			priority
		}
	}`);
};

/** |----------------------------
 *  | DELETE CATEGORY
 *  |----------------------------
 */
export const deleteCategory = async (id) => {
  console.log("deleteCategory request");
  return executeQuery(`mutation DeleteCategory {
		deleteCategory(id: "${id}") {
			_id
			name
			priority
			resume {
				_id
			}
		}
	}`);
};

/** |----------------------------
 *  | UPDATE TEMPLATE
 *  |----------------------------
 */
export const updateTemplate = async (templateId, data) => {
  console.log("updateTemplate request");
  return executeQuery(`mutation UpdateTemplate {
		updateTemplate(id: "${templateId}", data: {
			${stringifyObject(data)}
		}) {
			_id
			name
			style
		}
	}`);
};

/** |----------------------------
 *  | UPDATE ITEM'S PRIORITY
 *  |----------------------------
 */
// export const updateItemPriority = async (itemId, priority) => {
//   console.log("updateItem request");
//   return executeQuery(`mutation UpdateItem {
// 		updateItem(id: "${itemId}", data: {
// 			priority: ${priority}
// 		}) {
// 			priority
// 		}
// 	}`);
// };

/** |----------------------------
 *  | DELETE ITEM
 *  |----------------------------
 */
export const deleteItem = async (id) => {
  console.log("deleteItem request");
  return executeQuery(`mutation DeleteItem {
		deleteItem(id: "${id}") {
			_id
			title
			location
			from
			to
			description
			priority
			category {
				_id
			}
		}
	}`);
};

/** |----------------------------
 *  | UPDATE USER
 *  |----------------------------
 */
export const updateUser = async (id, username, email, bio) => {
  console.log("updateUser request");
  email = email.toLowerCase();
  return executeQuery(`mutation UpdateUser {
		updateUser(id: "${id}", data:{
			username: "${username}"
			email: "${email}"
			bio: """${bio}"""
		}) {
			username
			email
			bio
		}
	}`);
};

/** |----------------------------
 *  | GET USER BY ID
 *  |----------------------------
 */
export const readUser = async (id) => {
  console.log("readUser request");
  return executeQuery(`query FindAUserByID {
		findUserByID(id: "${id}") {
			${userData}
		}
	}`);
};
