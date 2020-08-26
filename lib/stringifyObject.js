const stringifyObject = (data) => {
  // Convert object to array of (key, value) pairs
  var entries = Object.entries(data);

  var keys = ""; // keys
  var pairs = ""; // (key, value) pairs
  for (var item of entries) {
    // Skip _id
    if (item[0] == "_id") {
      keys += item[0] + "\n";
      continue;
    }

    // Skip connects (objects)
    if (typeof item[1] == "object") {
      // console.log("OBJECT");
      // console.log("item[1]:", item[1]);
      // console.log("stringifyObject(item[1]):", stringifyObject(item[1]));
      // keys += stringifyObject(item[1]);
      continue;
    }

    if (typeof item[1] == "number" || typeof item[1] == "boolean") {
      // Don't stringify integers and booleans
      keys += item[0] + "\n";
      pairs += item[0] + ": " + item[1] + "\n";
    } else {
      // Stringify all others
      keys += item[0] + "\n";
      pairs += item[0] + ': """' + item[1] + '"""\n';
    }
  }
  return { pairs, keys };
};

export default stringifyObject;
