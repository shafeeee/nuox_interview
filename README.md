# nuox_interview
 shareholder and it's installment related questions

 Node version - v20.7.0

 For logging purpose - we use pino, right now, it will display the logs into console, but we can make pino to write errors, infos , warnings to the log file. we could create a module for that purpose

 For code quality, i have used Eslint 8.56.0, with airbnb-base coding style, we can change as per the needs. to run , eslint you have to enter npm run lint. You can see some errors when you run the eslint, it supposed to be very clear, but i rushed to complete the challange first. 
 
 Dotenv is used for processing the env values, so, before running the node project, Please set up the .env file. for eg:
        
        PORT=3000
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=password
        DB_NAME=example

 knex is used for database migration and handling, Please run npx knex migrate:latest for migrating the database, mysql as db driver
 insatlled express-validator for validating add share holder and create share.
 create a middleware folder to separate validation logic, it seems bit messy if it is in the same file.

 Regarding the Mysql datatypes, I have used decimal (8,2) for the amounts, Enum for the insatllment types, it is not fully optimized, we can do that later.

 Express webframework is used , V 4.18.2.

 I didn't optimize the CSS , you can see same css code in multipe places, It is because i didn't set the common layout for every page, every page has it's own layout now. Basically, Regarding the  front end , it is very very basic. I hope it will be ok, mostly i concentarted on the good structure of the backend.

 Regarding the security concern, i didn't encrypt the ids or other URL parameters, regarding the Sql injection, i used the knex , there should be another security layer added. i didn't have much time to complete this in  depth.

 Pagination is pending

 Some pages are not responsive

 There are still lot of perfection, optimization needed. i just leave it as it is due to the less time.

 How to install?
----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. After clone, Run `npm install` 
 2. Check the .env-example , change the values accordingly, like, dbname, dbuser,dbpassword and dbhost and rename it .env
 3. Run `npx knex migrate:latest` until all upto date
 4. Run `node app.js`
 5. Go to the host and port name, you can start testing by add share holder.
 6. Supported browser Chrome, Please test it with chrome.





