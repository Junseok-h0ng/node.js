const express = require('express');
const db = require('../lib/mysql');
const auth = require('../lib/auth');
var router = express.Router();

function page(req, res, filter) {
    var page = req.params.page;
    var max = page * 6;
    var min = max - 6;
    var prev = Number(page) - 1;
    if (prev === 0) {
        prev = 1;
    }
    var next = Number(page) + 1;
    db.list_filter(filter, min, max, function (topic) {
        res.render('./contents/menu', {
            topic: topic,
            list: req.list,
            login: auth.loginStatus(req),
            next: next,
            current: page,
            prev: prev
        });
    });

}

router.get('/:page', function (req, res) {
    page(req, res, 'desc');
});
router.get('/:page/:filter', function (req, res) {
    page(req, res, 'asc');
})
module.exports = router;