const mariadb = require('mariadb');

const db = process.env.MYSQL_DATABASE || 'sailrace_db';
const dbuser = process.env.MYSQL_USER || 'sailrace_user';
const dbpass = process.env.MYSQL_PASSWORD || 'myPass';
const dbport = process.env.MYSQL_PORT || 3306;
const dbhost = process.env.MYSQL_HOST || 'database';

// https://forum.codeselfstudy.com/t/tutorial-how-to-use-mysql-or-mariadb-with-node-js-and-express/2260
// https://www.cdata.com/kb/tech/mariadb-connect-nodejs.rst
// https://mariadb.com/docs/server/connect/programming-languages/nodejs/promise/connection-pools/


/**
 * Creates a new db connection pool
 */
const pool = mariadb.createPool({
    host: dbhost,
    port: dbport,
    user: dbuser, 
    password: dbpass,
    database: db,
    connectionLimit: 50,
    rowsAsArray: false
});


/**
 * Getter for connection pool
 * @returns connection pool
 */
function getConn()
{
   return pool;
}

module.exports = {
    getConn
};
