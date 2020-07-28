const express = require('express');
var router = express.Router();
const fs = require('fs');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');

router.get(`/:pageID`, function (req, res, next) {
    var title = req.params.pageID;
    var control =
        `<ul>
            <li><a href="/form/create">create</a></li>
            <li><a href="/form/update/${title}">update</a></li>
            <form action ="/process/delete" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
            </form>
        </ul>`;
    fs.readFile(`./data/${title}`, 'utf8', function (err, description) {
        if (err) {
            next(err);
        } else {
            var printHTML = template.html(title, req.list, description, control, auth.loginStatus(req));
            res.send(printHTML);
        }
    });
});

module.exports = router;