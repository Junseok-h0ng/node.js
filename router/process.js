const express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../lib/auth.js');
const shortid = require('shortid');
const db = require('../lib/mysql');

//생성 작업
router.post(`/create`, function (req, res) {
    var post = req.body;
    var info = {
        id: shortid.generate(),
        title: post.title,
        description: post.description,
        user: req.user.id
    }
    db.create(info);
    res.redirect(`/page/${info.id}`);
});
//수정 작업
router.post(`/update`, function (req, res) {
    var post = req.body;
    var info = {
        id: post.id,
        title: post.title,
        description: post.description
    }
    db.update(info);
    res.redirect(`/page/${info.id}`);
});
//삭제 작업
router.post(`/delete`, function (req, res) {
    //로그인 여부 확인
    if (!auth.authIsOwner(req)) {
        req.flash('error', 'need Login');
        res.redirect('/form/login');
    }
    var post = req.body;
    var id = post.id;
    db.page(id, function (err, topic) {
        if (topic[0].user_id === req.user.id) {
            db.delete(id);
        }
        res.redirect('/');
    });
});
//회원가입 작업
router.post(`/register`, function (req, res) {
    var post = req.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var nickname = post.nickname;

    db.user(email, function (err, user) {
        if (user[0]) {
            req.flash('error', '이미 있는 이메일 주소');
            res.redirect('/form/register');
        } else if (pwd != pwd2) {
            req.flash('error', '서로다른 패스워드 입력');
            res.redirect('/form/register');
        } else {
            bcrypt.hash(pwd, 10, function (err, hash) {
                var user = {
                    id: shortid.generate(),
                    email: email,
                    pwd: hash,
                    display: nickname
                }
                db.register(user);
                req.login(user, function () {
                    res.redirect('/');
                })
            });
        }
    });
});
module.exports = router;