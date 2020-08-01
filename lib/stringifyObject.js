const stringifyObject = (data) => {
	// Convert object to array of (key, value) pairs
	var entries = Object.entries(data)

	var res = ""
	for (var item of entries) {
			res += item[0] + ': """' + item[1] + '"""\n'
	}
	return res
}

export default stringifyObject