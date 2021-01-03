import { toast } from "react-toastify";

const getErrorMessage = (e) => {
  if (typeof e === "string") return e;
  return e[0].msg || e[0].message || e[0].description;
};
export const toastError = (err) => {
  toast.error(`⚠️ ${getErrorMessage(err)}`);
};
