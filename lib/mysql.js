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
        connection.query(sql, function (err, topic) {
            if (err) throw err;
            return callback(topic);
        });
    },
    page: function (pageID, callback) {
        var sql = 'SELECT * FROM topic WHERE topic.id = ?';
        connection.query(sql, [pageID], function (err, topic) {
            if (err) {
                throw err;
            }
            return callback(null, topic);
        });
    },
    create: function (info) {
        var sql = 'INSERT INTO topic(id,title,description,created,user_id) VALUES(?,?,?,NOW(),?)';
        connection.query(sql, [info.id, info.title, info.description, info.user]);
    },
    update: function (info) {
        var sql = 'UPDATE topic SET title=?,description=?,created=NOW() WHERE id = ?';
        connection.query(sql, [info.title, info.description, info.id]);
    },
    delete: function (id) {
        var sql = 'DELETE FROM topic WHERE id = ?';
        connection.query(sql, [id]);
    }
}
// module.exports = connection;