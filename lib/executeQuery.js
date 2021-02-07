import isEmptyReturnObject from "../lib/isEmptyReturnObject";

/**
 * Function to send queries to the database.
 */
const executeQuery = async (query, userSecret) => {
  console.info("===== QUERY =====\n", query, "\n===== RESULT ====");
  try {
    // Local (docker) fetch url: "http://localhost:8084/graphql"
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
    if (!data) {
      console.info("ERROR: no data\n=================\n");
      return [{ message: "No data was returned from executeQuery" }];
    } else if (data.errors) {
      console.info(data.errors);
      console.info("Query result: ERROR: errors\n=================\n");
      return data.errors;
    } else if (isEmptyReturnObject(data.data)) {
      console.info(data.data);
      console.info(
        "Query result: ERROR: empty return object\n=================\n"
      );
      return [{ message: "This item no longer exists. " }];
    }
    console.info(data.data);
    console.info("Query result: SUCCESS\n=================\n");
    return data.data;
  } catch (err) {
    console.info(err);
    console.info("Query result: EXECUTEQUERY ERROR\n=================\n");
    return [{ message: "executeQuery error " + err }];
  }
};

export default executeQuery;
