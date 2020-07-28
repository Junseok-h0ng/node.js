const express = require('express');
var router = express.Router();
const fs = require('fs');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
const db = require('../lib/db.js');

router.get(`/:pageID`, function (req, res, next) {
    var page = db.get('page').find({ id: req.params.pageID }).value();
    var title = page.title;
    var description = page.description;
    var user = db.get('users').find({
        id: page.user_id
    }).value();
    var control =
        `<p>by ${user.nickname}</p>
        <ul>
            <li><a href="/form/create">create</a></li>
            <li><a href="/form/update/${page.id}">update</a></li>
            <form action ="/process/delete" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
            </form>
        </ul>`;
    var printHTML = template.html(title, req.list, description, control, auth.loginStatus(req));
    res.send(printHTML);
});

module.exports = router;