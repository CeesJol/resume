export const auth = (body) => {
  return fetchFromAPI(body, 'auth')
};

export const confirm = (body) => {
  return fetchFromAPI(body, 'confirm')
};

export const fauna = (body) => {
  return fetchFromAPI(body, 'fauna')
};

const fetchFromAPI = async (body, route) => {
	try {
    const data = await fetch(`/api/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await data.json();
    return json;
  } catch (e) {
    throw new Error(e);
  }
}
