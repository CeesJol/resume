require("dotenv").config();

module.exports = {
  env: {
    FAUNADB_SECRET_KEY:
      process.env.NODE_ENV === "development"
        ? process.env.FAUNADB_SECRET_KEY_DEV
        : process.env.FAUNADB_SECRET_KEY,
    FAUNADB_GRAPHQL_ENDPOINT: "https://graphql.fauna.com/graphql",
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    EMAIL_SECRET: process.env.EMAIL_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    DOMAIN_NAME:
      process.env.NODE_ENV === "development"
        ? "localhost:3000"
        : process.env.DOMAIN_NAME,
    APP_NAME: "Luna",
  },
};
