const express = require('express');
var router = express.Router();
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
const db = require('../lib/mysql');
const data_template = require('../lib/data_template');
//수정 폼
router.get(`/update/:pageID`, function (req, res) {
    if (!auth.authIsOwner(req)) {
        req.flash('error', 'need Login');
        res.redirect('/form/login');
    } else {
        var pageID = req.params.pageID;
        db.page(pageID, function (err, topic) {
            if (topic[0].user_id == req.user.id) {
                var info = {
                    title: topic[0].title,
                    pageID: pageID,
                    data: topic[0].description
                }
                var printHTML = template.create(info);
                res.send(printHTML);
            } else {
                res.redirect('/');
            }
        });
    }
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
        res.redirect(`/form/login`);
    }
});
//회원가입 폼
router.get(`/register`, function (req, res) {
    var title = 'register';
    var fflash = req.flash();
    var feedback = '';
    if (fflash.error) {
        feedback = fflash.error[0];
    }
    var description = data_template.register(feedback)
    var printHTML = template.html(title, req.list, description, "", `<a href="/form/login">login</a>`);
    res.send(printHTML);
});
//로그인 폼
router.get(`/login`, function (req, res) {
    var title = 'login';
    var fflash = req.flash();
    var feedback = '';
    if (fflash.error) {
        feedback = fflash.error[0];
    }
    var description = data_template.login(feedback);
    var printHTML = template.html(title, req.list, description, "", data_template.login_control());
    res.send(printHTML);
});

module.exports = router;