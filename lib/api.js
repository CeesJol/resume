export const auth = (body) => {
  return fetchFromAPI(body, "auth");
};

export const send = (body) => {
  return fetchFromAPI(body, "send");
};

export const fauna = (body) => {
  return fetchFromAPI(body, "fauna");
};

// Source
// https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const fetchFromAPI = async (body, route) => {
  try {
    const userSecret = getCookie("secret") || null;
    // if (!userSecret) throw new Error("Unauthenticated");
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
};
