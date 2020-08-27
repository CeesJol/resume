const executeQuery = async (query, userSecret) => {
  try {
    // console.log("===== QUERY =====\n", query, "\n=================");
    const res = await fetch(process.env.FAUNADB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userSecret}`,
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });
    const data = await res.json();
    if (!data || data.errors) {
      return data
        ? data.errors
        : [{ message: "No data was returned from executeQuery" }];
    }
    return data.data;
  } catch (err) {
    return [{ message: "executeQuery error" + err }];
  }
};

export default executeQuery;
