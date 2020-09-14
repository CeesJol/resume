const handleError = (message) => {
  switch (message) {
    case "Instance is not unique.":
      return "An account with that email address already exists.";
    case "The instance was not found or provided password was incorrect.":
      return "Incorrect email or password.";
    default:
      return message;
  }
};

export default handleError;
