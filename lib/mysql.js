const mysql = require('mysql');
const db = require('../config/db.json');
const connection = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});
connection.connect();
module.exports = {
    getList: function (callback) {
        var sql = 'SELECT * from topic';
        connection.query(sql, function (err, results) {
            if (err) {
                throw err;
            }
            // console.log(results); // good
            return callback(results);
        }
        );
    },
    page: function (req, callback) {
        console.log(req.params.pageID);
        var sql = 'SELECT * FROM topic LEFT JOIN users ON topic.user_id = users.id WHERE topic.id = ?';
        connection.query(sql, [req.params.pageID], function (err, topic) {
            if (err) {
                throw err;
            }
            return callback(null, topic);
        });
    },
    create: function (info) {
        var sql = 'INSERT INTO topic(id,title,description,created,user_id) VALUES(?,?,?,NOW(),?)';
        connection.query(sql, [info.id, info.title, info.description, info.user]);
    }
}
// module.exports = connection;