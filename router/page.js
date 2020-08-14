const express = require('express');
var router = express.Router();
const db = require('../lib/mysql');
const auth = require('../lib/auth');

router.get(`/:pageID`, function (req, res, next) {
    var pageID = req.params.pageID;
    db.page(pageID, function (err, topic) {
        res.render('page', {
            id: topic[0].id,
            title: topic[0].title,
            description: topic[0].description,
            displayname: topic[0].displayname,
            created: topic[0].created,
            pageID: pageID,
            list: req.list,
            login: auth.loginStatus(req)
        });
    });
});
router.get(`/:pageID/:subPageID`, function (req, res, next) {
    res.send('hi');
})

module.exports = router;