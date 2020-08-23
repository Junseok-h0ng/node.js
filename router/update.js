const express = require('express');
var router = express.Router();
const auth = require('../lib/auth.js');
const db = require('../lib/mysql');
//수정 폼
router.get(`/:pageID`, function (req, res) {
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
router.get(`/:pageID/:subpageID`, function (req, res) {
    var pageID = req.params.pageID;
    var subpageID = req.params.subpageID;
    db.subpage(subpageID, function (err, topic) {
        var info = {
            title: topic[0].title,
            pageID: subpageID,
            parent: topic[0].parent_id,
            data: topic[0].description,
        }
        if (topic[0].parent === subpageID) {
            res.render('./crud/update', info);
        } else {
            res.redirect(`/page/${pageID}/${subpageID}`);
        }

    });

});

module.exports = router;