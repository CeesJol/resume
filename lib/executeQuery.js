const secret = process.env.FAUNADB_SECRET_KEY;

const executeQuery = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("===== QUERY =====\n", query, "\n=================");
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
