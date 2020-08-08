const mysql = require('mysql');
const db = require('./config/db.json');
const connection = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});
connection.connect();
function get_info(callback) {

    var sql = "SELECT * from topic";

    connection.query(sql, function (err, results) {
        if (err) {
            throw err;
        }
        // console.log(results); // good
        return callback(results);
    }
    )
}
exports.info = get_info(function (data) {
    return data;
})
module.exports = {
    handleTopic: function () {
        connection.query('SELECT * FROM topic', function (err, res) {
            this.getList(res);
        });
    },
    getList: function (res) {
        return res;
    },
    get_info: function (callback) {

        var sql = "SELECT * from topic";

        connection.query(sql, function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results); // good
            return callback(results);
        }
        )
    },
    getInfo: function () {
        get_info(function (data) {
            return data;
        });
    }
}