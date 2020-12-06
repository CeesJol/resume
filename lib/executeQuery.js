const executeQuery = async (query, userSecret) => {
  try {
    // console.info("===== QUERY =====\n", query, "\n=================");
    const secret =
      process.env.NODE_ENV === "development"
        ? process.env.FAUNADB_SECRET_KEY_DEV
        : process.env.FAUNADB_SECRET_KEY;
    // Local (docker) fetch url: "http://localhost:8084/graphql"
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
    try {
      console.log("data:", data.data.findUserByID.resumes.data[0].data);
    } catch (e) {}
    if (!data || data.errors) {
      return data
        ? data.errors
        : [{ message: "No data was returned from executeQuery" }];
    }
    return data.data;
  } catch (err) {
    return [{ message: "executeQuery error " + err }];
  }
};

export default executeQuery;
