const express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../lib/auth.js');
const shortid = require('shortid');
const db = require('../lib/mysql');


router.post(`/insert/board`, function (req, res) {
    var info = req.body;
    db.insert_board(info);
    res.redirect('/board');
});
router.post(`/delete/board`, function (req, res) {
    var id = req.body.id;
    var password = req.body.password;
    db.board_isOwner(id, (err, board) => {
        if (board[0].password === password) {
            db.delete_board(id);
        } else {
            req.flash('message', 'Wrong password');
        }
        res.redirect('/board');
    });

})
//생성 작업
router.post(`/create`, function (req, res) {
    var post = req.body;
    var info = {
        id: shortid.generate(),
        title: post.title,
        description: post.description,
        user: req.user.id
    }
    db.create(info, 'user_id', 'topic');
    res.redirect(`/page/${info.id}`);
});
//하위 페이지 생성
router.post('/create/:pageID', function (req, res) {
    var parent_id = req.params.pageID;
    var post = req.body;
    var info = {
        id: shortid.generate(),
        title: post.title,
        description: post.description,
        user: parent_id
    }
    db.create(info, 'parent_id', 'subtopic');
    res.redirect(`/page/${parent_id}/${info.id}`);
});
//수정 작업
router.post(`/update`, function (req, res) {
    var post = req.body;
    var info = {
        id: post.id,
        title: post.title,
        description: post.description,
    }
    db.update(info);
    res.redirect(`/page/${info.id}`);
});
//하위페이지 수정
router.post(`/update/:parent`, function (req, res) {
    var post = req.body;
    var parent = req.params.parent;
    var info = {
        id: post.id,
        title: post.title,
        description: post.description,
    }
    db.subupdate(info);
    res.redirect(`/page/${parent}/${info.id}`);
})
//삭제 작업
router.post(`/delete/:pageID`, function (req, res) {
    //로그인 여부 확인
    if (!auth.authIsOwner(req)) {
        req.flash('error', 'need Login');
        res.redirect('/login');
    }
    var id = req.params.pageID;
    db.page(id, function (err, topic) {
        if (topic[0].user_id === req.user.id) {
            db.delete(id, 'topic');
        }
        res.redirect('/menu');
    });
});
//삭제 작업
router.post(`/delete/:pageID/:subpageID`, function (req, res) {
    //로그인 여부 확인
    if (!auth.authIsOwner(req)) {
        req.flash('error', 'need Login');
        res.redirect('/login');
    }
    var id = req.params.subpageID;
    var pageID = req.params.pageID;
    var user = req.user.id;
    db.subpage(id, function (err, topic) {
        if (topic[0].user_id === user) {
            db.delete(id, 'subtopic');
        }
        res.redirect(`/page/${pageID}`);
    })
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
            res.redirect('/register');
        } else if (pwd != pwd2) {
            req.flash('error', '서로다른 패스워드 입력');
            res.redirect('/register');
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