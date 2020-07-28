const express = require('express');
var router = express.Router();
const fs = require('fs');
const auth = require('../lib/auth.js');
const db = require('../lib/db.js');
const shortid = require('shortid');

//생성 작업
router.post(`/create`, function (req, res) {
    var post = req.body;
    var title = post.title;
    var description = post.description;
    var id = shortid.generate();
    db.get('page').push({
        id: id,
        title: title,
        description: description,
        user_id: req.user.id
    }).write();
    res.redirect(`/page/${id}`);
});
//수정 작업
router.post(`/update`, function (req, res) {
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    var page = db.get('page').find({ id: id }).value();
    db.get('page').find({ id: id }).assign({
        title: title, description: description
    }).write();
    res.redirect(`/page/${page.id}`);
});
//삭제 작업
router.post(`/delete`, function (req, res) {
    if (auth.authIsOwner(req)) {
        var post = req.body;
        var id = post.id;
        fs.unlink(`data/${id}`, function (err) {
            res.redirect(`/`);
        });
    } else {
        req.flash('error', 'need login');
        res.redirect(`/form/login`);
    }
});
//회원가입 작업
router.post(`/register`, function (req, res) {
    var post = req.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var nickname = post.nickname;

    if (db.get('users').find({ email: email }).value()) {
        req.flash('error', '이미 있는 이메일 주소');
        res.redirect('/form/register');
    } else if (pwd != pwd2) {
        req.flash('error', 'Password must same');
        res.redirect('/form/register');
    } else {
        var user = {
            id: shortid.generate(),
            email: email,
            pwd: pwd,
            nickname: nickname
        }
        db.get('users').push(user).write();
        req.login(user, function (err) {
            return res.redirect('/');
        });
    }
});
module.exports = router;