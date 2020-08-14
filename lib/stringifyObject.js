const stringifyObject = (data) => {
  // Convert object to array of (key, value) pairs
  var entries = Object.entries(data);

  var res = "";
  for (var item of entries) {
		// Skip _id
		if (item[0] == "_id") continue;

		// Skip connects (objects)
		if (typeof item[1] == "object") continue;

		// Don't stringify integers and booleans
    if (typeof item[1] == "number" || typeof item[1] == "boolean")
			res += item[0] + ": " + item[1] + "\n";
			
		// Stringify all others
    else res += item[0] + ': """' + item[1] + '"""\n';
  }
  return res;
};

export default stringifyObject;
