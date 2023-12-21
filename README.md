# nuox_interview
 shareholder and it's installment related questions

 Node version - v20.7.0

 for logging purpose - we use pino, right now, it will display the logs into console, but we can make pino to write errors, infos , warnings to the log file. we could create a module for that purpose

 for code quality, i have used Eslint 8.56.0, with airbnb-base coding style, we can change as per the needsto run , eslint you have to enter npm run lint.
 
 dotenv is used for processing the env values, so, before running the node project, Please set up the .env file. for eg:
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=password
        DB_NAME=nuox_shares

 knex is used for database migration and handling, Please run npx knex migrate:latest for migrating the database, mysql as db driver
 insatlled express-validator for validating add share holder and create share.
 create a middleware folder to separate validation logic, it seems bit messy if it is in the same file


