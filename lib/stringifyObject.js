const stringifyObject = (data) => {
  // Convert object to array of (key, value) pairs
  var entries = Object.entries(data);

  var res = "";
  for (var item of entries) {
    if (typeof item[1] == "number" || typeof item[1] == "boolean")
      res += item[0] + ": " + item[1] + "\n";
    else res += item[0] + ': """' + item[1] + '"""\n';
  }
  return res;
};

export default stringifyObject;
