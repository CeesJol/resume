const logOnDev = (x) => {
  if (process.env.NODE_ENV === "development") {
    console.info(x);
  }
};

export default logOnDev;
