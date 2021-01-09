/**
 * Check if every key in object is null
 * Used to see if a GraphQL query returned no data, indicating that
 * something went wrong, like the object no longer exists
 * Source: https://stackoverflow.com/questions/27709636/determining-if-all-attributes-on-a-javascript-object-are-null-or-an-empty-string
 */

const isEmptyReturnObject = (obj) => {
  for (var key in obj) {
    if (obj[key] !== null) {
      return false;
    }
  }
  return true;
};

export default isEmptyReturnObject;
