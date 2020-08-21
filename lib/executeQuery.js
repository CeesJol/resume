const executeQuery = async (query, userSecret) => {
  return new Promise(async (resolve, reject) => {
    console.log(">>>>>>using secret: ", userSecret);
    try {
      console.log("===== QUERY =====\n", query, "\n=================");
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
        console.log(data && "errors: " + data.errors);
        reject(data.errors);
      }
      resolve(data.data);
    } catch (e) {
      reject(e);
    }
  });
};

export default executeQuery;
