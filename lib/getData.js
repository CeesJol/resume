/**
 * If no data is returned, or the server returns an error, return -1
 * Otherwise return the data
 */
// TODO
// If the error message is that the user is unauthenticated,
// Log out the user on the client and handle the error gently.
export default function getData(data) {
  if (data.errors) {
    console.log('errors :(', data.errors);
    return -1;
  }
  if (!data || data.errors) return -1;
  return data.data;
}