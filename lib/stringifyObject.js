const stringifyObject = (data) => {
  // Convert object to array of (key, value) pairs
  let entries = Object.entries(data);

  let keys = ""; // keys
  let pairs = ""; // (key, value) pairs

  for (let item of entries) {
    // Skip _id
    if (item[0] === "_id") {
      keys += item[0] + "\n";
      continue;
    }

    // JSON.Stringify resume data
    if (item[0] === "data") {
      item[1] = JSON.stringify(item[1]);
    }

    // Skip connects (objects)
    if (typeof item[1] === "object") {
      continue;
    }

    if (typeof item[1] === "number" || typeof item[1] === "boolean") {
      // Don't stringify integers and booleans
      keys += item[0] + "\n";
      pairs += item[0] + ": " + item[1] + "\n";
    } else {
      // Stringify all others
      keys += item[0] + "\n";

      // Append strings ending with " with a space to prevent bug
      if (item[1].endsWith('"')) {
        item[1] = item[1] + " ";
      }
      pairs += item[0] + ': """' + item[1] + '"""\n';
    }
  }

  return { pairs, keys };
};

export default stringifyObject;
