const express = require('express');
var router = express.Router();
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
const db = require('../lib/mysql');

router.get(`/:pageID`, function (req, res, next) {
    var pageID = req.params.pageID;
    db.page(pageID, function (err, topic) {
        var title = topic[0].title;
        var description = topic[0].description;
        var control = {
            'displayname': topic[0].displayname,
            'pageID': pageID
        };
        var printHTML = template.html(title, req.list, description, control, auth.loginStatus(req));
        res.send(printHTML);
    });
});
module.exports = router;