# Affilas

A resume builder, made with Next.js and FaunaDB.

## Setup

### Application

1. Copy the `.env.example` file and name it `.env` in the root directory.
2. Fill in the values:  
   FAUNADB_SECRET_KEY_DEV: your faunadb secret key (see below)  
   COOKIE_SECRET: any string value
3. Optionally, fill in these values:  
   FAUNADB_SECRET_KEY: your faunadb secret key. only needed for production  
   EMAIL_SECRET: any string value  
   SENDGRID_API_KEY: your sendgrid secret key  
   FROM_EMAIL: your sendgrid email  
   DOMAIN_NAME: your production url
4. Run `yarn install`
5. Visit localhost:3000 to see the app running!

### Database

1. Create an account at [FaunaDB](https://dashboard.fauna.com/accounts/register)
2. Create a database on Fauna.
3. Go to the Security tab, create a secret key and store in the .env file.
4. Go to the GraphQL tab and press "Update schema". Upload the schema.gql in the root folder.
5. Go to the Functions tab. Copy each function from /fauna/functions into the Fauna's corresponding function.\*
6. Go the the Index tab. Create an index called "resumesByUser" for source collection "Resume". In the terms field, paste "data.user.id" (without the quotes). Leave the values field empty, Unique unchecked and Serialized checked.
7. Go the Shell tab and paste /fauna/roles/user.fql in there and press enter.

### Get started

Create an account at localhost:3000/signup. Your API will give an error if you haven't set up the email environment variables, since it tries to send a confirmation email, but that's fine as it doesn't break the application. The resume creation process should be straightforward.

\* Hopefully [FDM](https://docs.fauna.com/fauna/current/integrations/fdm/) will do this kind of work for you in the future.
