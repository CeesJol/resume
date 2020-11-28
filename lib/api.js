import handleError from "./handleError";

export const send = (body) => {
  return fetchFromAPI(body, "send");
};

export const fauna = (body) => {
  return fetchFromAPI(body, "fauna");
};

export const PDF = (body) => {
  return fetchFromAPI(body, "PDF");
};

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
        return reject(handleError(json[0].message));
      } else {
        return resolve(json);
      }
    } catch (err) {
      return reject("fetchFromAPI error" + err);
    }
  });
};
