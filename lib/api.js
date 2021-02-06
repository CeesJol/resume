import handleErrors from "./handleErrors";

/**
 * API used to send emails.
 */
export const send = (body) => {
  return fetchFromAPI(body, "send");
};

/**
 * API used to communicate with the database.
 */
export const fauna = (body) => {
  return fetchFromAPI(body, "fauna");
};

/**
 * API used for PDF export.
 * Currently not used.
 */
export const PDF = (body) => {
  return fetchFromAPI(body, "PDF");
};

/**
 * Function to send HTTP request to API.
 */
const fetchFromAPI = async (body, route) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fetch(`/api/${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const json = await data.json();
      if (json[0]) {
        return reject(handleErrors(json));
      } else {
        return resolve(json);
      }
    } catch (err) {
      return reject("fetchFromAPI error" + err);
    }
  });
};
