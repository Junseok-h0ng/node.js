const express = require('express');
var router = express.Router();
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
const db = require('../lib/mysql');
//수정 폼
router.get(`/update/:pageID`, function (req, res) {
    if (!auth.authIsOwner(req)) {
        req.flash('error', 'need Login');
        res.redirect('/login');
    } else {
        var pageID = req.params.pageID;
        db.page(pageID, function (err, topic) {
            if (topic[0].user_id == req.user.id) {
                var info = {
                    title: topic[0].title,
                    pageID: pageID,
                    parent: null,
                    data: topic[0].description
                }
                res.render('./crud/update', info);
            } else {
                var backURL = req.header('Referer') || '/';
                res.redirect(backURL);
            }
        });
    }
});
router.get(`/update/:pageID/:subpageID`, function (req, res) {
    var subpageID = req.params.subpageID
    db.subpage(subpageID, function (err, topic) {
        var info = {
            title: topic[0].title,
            pageID: subpageID,
            parent: topic[0].parent_id,
            data: topic[0].description,
        }
        res.render('./crud/update', info);
    });

});
//생성 폼
router.get(`/create`, function (req, res) {
    if (auth.authIsOwner(req)) {
        var info = {
            title: "createPage"
        }
        var printHTML = template.create(info);
        res.send(printHTML);
    } else {
        req.flash('error', 'need login');
        res.redirect(`/login`);
    }
});

module.exports = router;