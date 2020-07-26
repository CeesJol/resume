import executeQuery from "../../lib/executeQuery";

/** |----------------------------
 *  | GET ITEMS BY USERNAME
 *  |----------------------------
 */
export const getUserItems = async (username) => {
	console.log('getUserItems request');
  username = username.toLowerCase();
  return executeQuery(`query FindItemsByID {
		userByUsername(username: "${username}") {
			confirmed
			items {
				data {
					_id
					title
					description
					location
					from
					to
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
	console.log('getUserByEmail request');
  email = email.toLowerCase();
  return executeQuery(`query FindAUserByEmail {
		userByEmail(email: "${email}") {
			username
			email
			confirmed
			bio
			resumes {
				data {
					_id
					title
					categories {
						data {
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
					}
				}
			}
		}
	}`);
};

/** |----------------------------
 *  | GET ITEMS BY EMAIL
 *  |----------------------------
 */
export const getUserItemsByEmail = async (email) => {
	console.log('getUserItemsByEmail request');
  email = email.toLowerCase();
  return executeQuery(`query FindItemsByEmail {
		userByEmail(email: "${email}") {
			items {
				data {
					_id
					title
					type
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
 *  | CREATE ITEM
 *  |----------------------------
 */
export const createItem = async (categoryId, data) => {
	console.log('createItem request');
  return executeQuery(`mutation CreateItem {
		createItem(data: {
			title: "${data.title}"
			location: "${data.location}"
			from: "${data.from}"
			to: "${data.to}"
			description: """${data.description}"""
			category: { connect: "${categoryId}" }
		}) {
			title
		}
	}`);
};

/** |----------------------------
 *  | CREATE CATEGORY WITH ITEM
 *  |----------------------------
 */
export const createCategoryWithItem = async (resumeId, categoryName, data) => {
	console.log('createCategoryWithItem request');
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
 *  | UPDATE ITEM
 *  |----------------------------
 */
export const updateItem = async (categoryId, data) => {
	console.log('updateItem request');
	console.log(categoryId);
	console.log(data);
  return executeQuery(`mutation UpdateItem {
		updateItem(id: "${data.id}", data:{
			title: "${data.title}"
			location: "${data.location}"
			from: "${data.from}"
			to: "${data.to}"
			description: """${data.description}"""
			category: { connect: "${categoryId}" }
		}) {
			title
			location
			from
			to
			description
		}
	}`);
};

/** |----------------------------
 *  | DELETE ITEM
 *  |----------------------------
 */
export const deleteItem = async (id) => {
	console.log('deleteItem request');
  return executeQuery(`mutation DeleteItem {
		deleteItem(id: "${id}") {
			_id
		}
	}`);
};

/** |----------------------------
 *  | UPDATE USER
 *  |----------------------------
 */
export const updateUser = async (id, username, email, bio) => {
	console.log('updateUser request');
  email = email.toLowerCase();
  username = username.toLowerCase();
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
	console.log('readUser request');
  return executeQuery(`query FindAUserByID {
		findUserByID(id: "${id}") {
			username
			email
			confirmed
			bio
			resumes {
				data {
					_id
					title
					categories {
						data {
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
									category {
										_id
									}
								}
							}
						}
					}
				}
			}
		}
	}`);
};
