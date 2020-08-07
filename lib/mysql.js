const mysql = require('mysql');
const db = require('../config/db.json');
const connection = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});
connection.connect();

module.exports = connection;