export const send = (body) => {
  return fetchFromAPI(body, "send");
};

export const fauna = (body) => {
  return fetchFromAPI(body, "fauna");
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
        return reject(json[0].message);
      } else {
        return resolve(json);
      }
    } catch (err) {
      return reject("fetchFromAPI error" + err);
    }
  });
};
