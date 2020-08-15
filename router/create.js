const express = require('express');
const db = require('../lib/mysql');
const auth = require('../lib/auth');
var router = express.Router();

router.get('/', function (req, res) {
    if (auth.authIsOwner(req)) {
        res.render('./crud/create', { pageID: null });
    } else {
        res.redirect('/login');
    }
});
router.get('/:pageID', function (req, res) {
    var pageID = req.params.pageID;
    if (!auth.authIsOwner(req)) {
        res.redirect('/login');
    } else {
        db.page(pageID, function (err, topic) {
            if (topic[0].user_id === req.user.id) {
                res.render('./crud/create', { pageID: req.params.pageID });
            } else {
                res.redirect(`/page/${pageID}`);
            };
        });
    }
});

module.exports = router;