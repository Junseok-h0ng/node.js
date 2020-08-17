const express = require('express');
const db = require('../lib/mysql');
const auth = require('../lib/auth');
var router = express.Router();

function renderPage(req, res, mod) {
    var userID = req.params.userID;
    res.render('./users/user', {
        userID: userID,
        list: req.list,
        login: auth.loginStatus(req),
        mod: mod
    });
}

router.get('/:userID', function (req, res) {
    renderPage(req, res, null);
});

router.get('/edit/:userID', function (req, res) {
    renderPage(req, res, 'edit_info');
});

router.get('/delete/:userID', function (req, res) {
    renderPage(req, res, 'delete');
});

router.post('/delete/:userID', function (req, res) {
});
router.post('/edit/:userID', function (req, res) {

});

module.exports = router;