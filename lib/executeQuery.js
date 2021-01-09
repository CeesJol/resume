import isEmptyReturnObject from "../lib/isEmptyReturnObject";
import logOnDev from "../lib/logOnDev";

const executeQuery = async (query, userSecret) => {
  try {
    // console.info("===== QUERY =====\n", query, "\n=================");
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
    logOnDev(data);
    if (isEmptyReturnObject(data.data)) {
      logOnDev("Error: empty return object");
      return [{ message: "This object no longer exists. " }];
    } else if (!data || data.errors) {
      logOnDev("Error: no data");
      return [{ message: "No data was returned from executeQuery" }];
    } else if (data.errors) {
      logOnDev("Error: errors");
      return data.errors;
    }
    logOnDev("Success");
    return data.data;
  } catch (err) {
    return [{ message: "executeQuery error " + err }];
  }
};

export default executeQuery;
