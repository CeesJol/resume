const secret = process.env.FAUNADB_SECRET_KEY;

const executeQuery = async (query) => {
	try {
		const res = await fetch(process.env.FAUNADB_GRAPHQL_ENDPOINT, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${secret}`,
				"Content-type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				query,
			}),
		});
		const data = await res.json();

		if (!data || data.errors) {
			console.log(data && data.errors);
			return -1;
		}
  	return data.data;
	} catch (e) {
		throw new Error(e);
	}
};

export default executeQuery;