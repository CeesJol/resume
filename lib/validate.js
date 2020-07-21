const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const websiteRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

export const validateSignup = (email, username, password) => {
  if (!email) {
    return "Please type in your email";
  } else if (!emailRegex.test(email)) {
		return "Please provide a valid email";
	} else if (!username.trim()) {
		return "Please provide a username"
	} else if (username.trim().length < 3) {
		return "Username is too short (min. 3 characters)";
  } else if (!password) {
    return "Please create a password";
  } else if (password.length < 8) {
    return "Password is too short (min. 8 characters)";
  }
};

export const validateLogin = (email, password) => {
  if (!email) {
    return "Please type in your email";
  } else if (!emailRegex.test(email)) {
    return "Please provide a valid email";
  } else if (!password) {
    return "Please create a password";
  } else if (password.length < 8) {
    return "Password is too short (min. 8 characters)";
  }
};

export const validateUpdate = (username, email, website) => {
	if (!email) {
    return "Please type in your email";
  } else if (!emailRegex.test(email)) {
		return "Please provide a valid email";
	} else if (!username.trim()) {
		return "Please provide a username";
	} else if (username.trim().length < 3) {
		return "Username is too short (min. 3 characters)";
	} else if (website && !websiteRegex.test(website)) {
		return "Please provide a valid website, or leave it blank";
	}
}

export const validatePassword = (password) => {
  if (!password) {
    return "Please create a password";
  } else if (password.length < 8) {
    return "Password is too short (min. 8 characters)";
  }
};

export const validateWebsite = (website) => {
	if (!websiteRegex.test(website)) {
		return "Please provide a valid website (make sure it starts with http(s))";
	}
}