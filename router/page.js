const express = require('express');
var router = express.Router();
const db = require('../lib/mysql');
const auth = require('../lib/auth');
const template = require('../lib/template');

router.get(`/:pageID`, function (req, res, next) {
    var pageID = req.params.pageID;
    db.page(pageID, function (err, topic) {
        console.log(topic);
        db.sublist(pageID, function (err, sublist) {
            res.render('page', {
                title: topic[0].title,
                description: topic[0].description,
                displayname: "by " + topic[0].displayname,
                created: topic[0].created,
                pageID: pageID,
                list: req.list,
                sublist: template.list(sublist, pageID + '/'),
                login: auth.loginStatus(req)
            });
        });

    });
});
router.get(`/:pageID/:subPageID`, function (req, res, next) {
    var subpageID = req.params.subPageID;
    var pageID = req.params.pageID;
    db.subpage(subpageID, function (err, topic) {
        res.render('subpage', {
            title: topic[0].title,
            description: topic[0].description,
            created: topic[0].created,
            displayname: '',
            pageID: pageID,
            subpageID: subpageID,
            list: req.list,
            login: auth.loginStatus(req)
        });
    });
});


module.exports = router;