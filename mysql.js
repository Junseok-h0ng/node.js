var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: '111111',
    database: 'test'
});
connection.connect();
connection.query('SELECT * FROM topic ', function (error, topics, fields) {
    if (error) throw error;
    exports.topics = topics;
});

connection.query(`SELECT * FROM topic WHERE id = 3`, function (err, page) {
    if (err) throw err;
});


connection.end();