import executeQuery from "../../lib/executeQuery";

/** |----------------------------
 *  | GET PRODUCTS BY USERNAME
 *  |----------------------------
 */
export const getUserProducts = async (username) => {
	username = username.toLowerCase();
  return executeQuery(`query FindProductsByID {
		user(username: "${username}") {
			confirmed
			products {
				data {
					_id
					imageUrl
					productUrl
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
 *  | GET PRODUCTS BY EMAIL
 *  |----------------------------
 */
export const getUserProductsByEmail = async (email) => {
	email = email.toLowerCase();
  return executeQuery(`query FindProductsByEmail {
		userByEmail(email: "${email}") {
			products {
				data {
					_id
					productUrl
					imageUrl
				}
			}
		}
	}`);
};

/** |----------------------------
 *  | CREATE PRODUCT
 *  |----------------------------
 */
export const createProduct = async (user, productUrl, imageUrl) => {
  return executeQuery(`mutation CreateProduct {
		createProduct(data: {
			imageUrl: "${imageUrl}"
			productUrl: "${productUrl}"
			user: { connect: "${user.id}" }
		}) {
			imageUrl
			productUrl
		}
	}`);
};

/** |----------------------------
 *  | UPDATE PRODUCT
 *  |----------------------------
 */
export const updateProduct = async (id, productUrl, imageUrl) => {
  return executeQuery(`mutation UpdateProduct {
		updateProduct(id: "${id}", data:{
			imageUrl: "${imageUrl}"
			productUrl: "${productUrl}"
		}) {
			imageUrl
			productUrl
		}
	}`);
};

/** |----------------------------
 *  | DELETE PRODUCT
 *  |----------------------------
 */
export const deleteProduct = async (id) => {
  return executeQuery(`mutation DeleteProduct {
		deleteProduct(id: "${id}") {
			imageUrl
			productUrl
		}
	}`);
};

/** |----------------------------
 *  | UPDATE USER
 *  |----------------------------
 */
export const updateUser = async (id, username, email, website) => {
	email = email.toLowerCase();
	username = username.toLowerCase();
  return executeQuery(`mutation UpdateUser {
		updateUser(id: "${id}", data:{
			username: "${username}"
			email: "${email}"
			website: "${website}"
		}) {
			username
			email
			website
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
			website
		}
	}`);
};
