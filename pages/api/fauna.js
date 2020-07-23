import executeQuery from "../../lib/executeQuery";

/** |----------------------------
 *  | GET ITEMS BY USERNAME
 *  |----------------------------
 */
export const getUserItems = async (username) => {
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
	email = email.toLowerCase();
  return executeQuery(`query FindAUserByEmail {
		userByEmail(email: "${email}") {
			username
			confirmed
		}
	}`);
};

/** |----------------------------
 *  | GET ITEMS BY EMAIL
 *  |----------------------------
 */
export const getUserItemsByEmail = async (email) => {
	email = email.toLowerCase();
  return executeQuery(`query FindItemsByEmail {
		userByEmail(email: "${email}") {
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
 *  | CREATE ITEM
 *  |----------------------------
 */
export const createItem = async (user, data) => {
  return executeQuery(`mutation CreateItem {
		createItem(data: {
			title: "${data.title}"
			type: "${data.type}"
			location: "${data.location}"
			from: "${data.from}"
			to: "${data.to}"
			description: """${data.description}"""
			user: { connect: "${user.id}" }
		}) {
			title
		}
	}`);
};

/** |----------------------------
 *  | UPDATE ITEM
 *  |----------------------------
 */
export const updateItem = async (id, data) => {
  return executeQuery(`mutation UpdateItem {
		updateItem(id: "${id}", data:{
			title: "${data.title}"
		}) {
			title
		}
	}`);
};

/** |----------------------------
 *  | DELETE ITEM
 *  |----------------------------
 */
export const deleteItem = async (id) => {
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
  return executeQuery(`query FindAUserByID {
		findUserByID(id: "${id}") {
			username
			email
			confirmed
			bio
		}
	}`);
};
