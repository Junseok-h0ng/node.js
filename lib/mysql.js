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
    list: function (callback) {
        var sql = `SELECT * FROM topic `;
        connection.query(sql, function (err, topic) {
            if (err) throw err;
            return callback(topic);
        });
    },
    sublist: function (id, callback) {
        var sql = 'SELECT * FROM subtopic WHERE parent_id = ?';
        connection.query(sql, [id], function (err, topic) {
            if (err) throw err;
            return callback(null, topic);
        });
    },
    list_filter: function (filter, min, max, callback) {
        var sql = `SELECT * FROM topic order by id ${filter} limit ${min},${max}`;
        connection.query(sql, function (err, topic) {
            if (err) throw err;
            return callback(topic);
        })
    },
    slice: function (des, callback) {
        var sql = `SELECT LEFT(${des},30)`
        connection.query(sql, function (err, res) {
            if (err) throw err;
            return callback(null, res);
        });
    },
    page: function (pageID, callback) {
        var sql = `SELECT * FROM topic LEFT JOIN users ON topic.user_id = users.id WHERE topic.id = ?`;
        connection.query(sql, [pageID], function (err, topic) {
            if (err) {
                throw err;
            }
            return callback(null, topic);
        });
    },
    subpage: function (id, callback) {
        var sql = 'SELECT subtopic.*,topic.user_id FROM subtopic LEFT JOIN topic ON topic.id = subtopic.parent_id WHERE subtopic.id = ?';
        connection.query(sql, [id], function (err, topic) {
            if (err) throw err;
            return callback(null, topic);
        });
    },
    create: function (info, id, location) {
        var sql = `INSERT INTO ${location}(id,title,description,created,${id}) VALUES(?,?,?,NOW(),?)`;
        connection.query(sql, [info.id, info.title, info.description, info.user]);
    },
    update: function (info) {
        var sql = `UPDATE topic SET title=?,description=?,created=NOW() WHERE id = ?`;
        connection.query(sql, [info.title, info.description, info.id]);
    },
    subupdate: function (info) {
        var sql = `UPDATE subtopic SET title=?, description=?,created=NOW() WHERE id = ?`;
        connection.query(sql, [info.title, info.description, info.id]);
    },
    delete: function (id, location) {
        var sql = `DELETE FROM ${location} WHERE id = ?`;
        connection.query(sql, [id], () => { this.delete_sub(id); });
    },
    delete_sub: function (id) {
        var sql = 'DELETE FROM subtopic WHERE parent_id = ?';
        connection.query(sql, [id])
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
        });
    },
    register: function (user, type) {
        var sql = 'INSERT INTO users(id,email,pwd,type,displayname) VALUES(?,?,?,?,?)';
        connection.query(sql, [user.id, user.email, user.pwd, user.type, user.display]);
    },
    change_password: function (pwd, id) {
        var sql = 'UPDATE users set pwd =? where id =?';
        connection.query(sql, [pwd, id]);
    },
    content_user_filter(userID, callback) {
        connection.query('SELECT * FROM topic where user_id = ?', [userID], (err, topics) => {
            if (err) throw err;
            return callback(null, topics);
        });
    },
    sub_user_filter(id, callback) {

        var sql = 'SELECT * FROM subtopic WHERE parent_id = ?'
        for (var i = 0; i < id.length; i++) {
            connection.query(sql, id[i].id, (err, subtopics) => {
                return callback(null, subtopics);
            });
        }
    },

    delete_user: function (userID) {
        var sql = 'DELETE FROM users WHERE id = ?';
        connection.query(sql, [userID], () => { this.delete_all_topic(userID) });
    },
    delete_all_topic: function (userID) {
        var main_topic = 'DELETE FROM topic WHERE user_id = ?';
        var sub_topic = 'DELETE FROM subtopic WHERE parent_id = ?'
        this.content_user_filter(userID, (err, topics) => {
            for (var i = 0; i < topics.length; i++) {
                connection.query(sub_topic, [topics[i].id]);
            }
        });
        connection.query(main_topic, [userID]);
    },
    insert_board: function (info) {
        var sql = 'INSERT INTO board(title,content,date,author,password) VALUE(?,?,NOW(),?,?)';
        connection.query(sql, [info.title, info.content, info.author, info.password], () => {
            this.re_sort();
        });
    },
    board_isOwner: function (id, callback) {
        var sql = 'SELECT * FROM board WHERE id = ?';
        connection.query(sql, [id], (err, board) => {
            if (err) throw err;
            return callback(null, board);
        });
    },
    delete_board: function (id) {
        var sql = 'DELETE FROM board WHERE id = ?';
        connection.query(sql, [id], () => {
            this.re_sort();
        });
    },
    list_board: function (min, max, filter, callback) {
        var sql = `SELECT * FROM board order by id ${filter} limit ${min},${max}`;
        connection.query(sql, (err, board) => {
            if (err) throw err;
            return callback(null, board);
        })
    },
    re_sort: function () {
        connection.query('SET @cnt = 0', () => {
            connection.query('UPDATE board SET board.id = @cnt:=@cnt + 1');
        });
    }
}