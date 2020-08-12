const express = require('express');
var router = express.Router();
const db = require('../lib/mysql');
const auth = require('../lib/auth');

router.get(`/:pageID`, function (req, res, next) {
    var pageID = req.params.pageID;
    db.page(pageID, function (err, topic) {
        res.render('page', {
            title: topic[0].title,
            description: topic[0].description,
            displayname: topic[0].displayname,
            pageID: pageID,
            list: req.list,
            login: auth.loginStatus(req)
        });
    });
});

module.exports = router;