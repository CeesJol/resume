const DEFAULT_RESPONSE =
  "A server side error occurred. Please try again later.";

const handleErrors = (errors) => {
  const result = [];

  for (var error of errors) {
    const message =
      error.message || error.description || error.validationMessage;
    switch (message) {
      case "Instance is not unique.":
        result.push({
          ...error,
          msg: "An account with that email address already exists.",
        });
        break;
      case "The instance was not found or provided password was incorrect.":
        result.push({
          ...error,
          msg: "Incorrect email or password.",
        });
        break;
      default:
        if (error.validationMessage) {
          // Validation error
          result.push({ msg: message });
        } else {
          result.push({ ...error, msg: DEFAULT_RESPONSE });
        }
    }
  }

  return result;
};

export default handleErrors;
