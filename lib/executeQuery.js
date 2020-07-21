import getData from "./getData"
import useFetch from "./useFetch"

const secret = process.env.FAUNADB_SECRET_KEY;

export default async (query) => {
  const data = await useFetch(process.env.FAUNADB_GRAPHQL_ENDPOINT, {
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

  return getData(data);
};