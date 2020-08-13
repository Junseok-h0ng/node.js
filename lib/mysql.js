const mysql = require('mysql');
const db = require('../config/db.json');
const connection = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    dateStrings: 'date'
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
        var sql = 'SELECT * FROM topic LEFT JOIN users ON topic.user_id = users.id WHERE topic.id = ?';
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
    },
    user: function (email, callback) {
        var sql = 'SELECT * FROM users WHERE email = ?';
        connection.query(sql, [email], function (err, user) {
            if (err) throw err;
            return callback(null, user);
        });
    },
    userID: function (id, callback) {
        var sql = 'SELECT * FROM users WHERE id = ?';
        connection.query(sql, [id], function (err, user) {
            if (err) throw err;
            return callback(null, user);
        })
    },
    register: function (user) {
        var sql = 'INSERT INTO users(id,email,Identi,displayname) VALUES(?,?,?,?)';
        connection.query(sql, [user.id, user.email, user.pwd, user.display]);
    }
}