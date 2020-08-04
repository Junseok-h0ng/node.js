const express = require('express');
var router = express.Router();
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
const db = require('../mysql.js');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: '111111',
    database: 'test'
});
connection.connect();

router.get(`/:pageID`, function (req, res, next) {
    connection.query(`SELECT * FROM topic WHERE id=${req.params.pageID}`, function (err2, topic) {
        if (err2) throw err2;

        var title = topic[0].title;
        var description = topic[0].description;
        var control =
            `
        <ul>
            <li><a href="/form/create">create</a></li>
            <li><a href="/form/update/${req.params.id}">update</a></li>
            <form action ="/process/delete" method="post">
                <input type="hidden" name="id" value="${req.params.id}">
                <input type="submit" value="delete">
            </form>
        </ul>`;
        var printHTML = template.html(title, req.list, description, control, auth.loginStatus(req));
        res.send(printHTML);
    });
});

module.exports = router;