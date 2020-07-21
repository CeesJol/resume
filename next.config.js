require('dotenv').config()

module.exports = {
  env: {
		'FAUNADB_SECRET_KEY': process.env.FAUNADB_SECRET_KEY,
		'FAUNADB_GRAPHQL_ENDPOINT': 'https://graphql.fauna.com/graphql',
		'EMAIL_SECRET': process.env.EMAIL_SECRET,
		'SENDGRID_API_KEY': process.env.SENDGRID_API_KEY,
		'FROM_EMAIL': process.env.FROM_EMAIL,
		'DOMAIN_NAME': process.env.DOMAIN_NAME
  }
}