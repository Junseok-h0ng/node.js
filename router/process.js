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
        user: 'id'
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
    // connection.query('UPDATE topic SET title=?,description=?,created=NOW() WHERE id = ?', [title, description, id], function () {
    //     res.redirect(`/page/${id}`)
    // })
    // var page = db.get('page').find({ id: id }).value();
    // db.get('page').find({ id: id }).assign({
    //     title: title, description: description
    // }).write();
    // res.redirect(`/page/${page.id}`);
});
//삭제 작업
router.post(`/delete`, function (req, res) {
    //로그인 여부 확인
    // if (!auth.authIsOwner(req)) {
    //     res.redirect('/');
    //     return false;
    // }
    var post = req.body;
    var id = post.id;
    db.page(id, function (err, topic) {
        db.delete(topic[0].id);
        res.redirect('/');
    });
    // connection.query('SELECT * FROM topic WHERE id=?', [id], function (err, topic) {
    //     if (topic[0].user_id == req.user.id) {
    //         connection.query('DELETE FROM topic WHERE id = ?', [id], function () {
    //         });
    //     };
    //     res.redirect('/');
    // });


    // var page = db.get('page').find({ id: id }).value();
    // //페이지 주인 과 접속한 유저 일치 확인 
    // if (page.user_id != req.user.id) {
    //     // req.flash('error','Not yours');
    //     res.redirect('/');
    // } else {
    //     db.get('page').remove({ id: id }).write();
    //     res.redirect('/');
    // }
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

    // connection.query('SELECT * FROM users where email = ?', [email], function (err, user) {
    //     if (user[0]) {
    //         req.flash('error', '이미 있는 이메일 주소');
    //         res.redirect('/form/register');
    //     } else if (pwd != pwd2) {
    //         req.flash('error', '서로다른 패스워드 입력');
    //         res.redirect('/form/register');
    //     } else {
    //         bcrypt.hash(pwd, 10, function (err, hash) {
    //             var user = {
    //                 id: shortid.generate(),
    //                 email: email,
    //                 pwd: hash,
    //                 display: nickname
    //             }
    //             connection.query('INSERT INTO users(id,email,Identi,displayname) VALUES(?,?,?,?)',
    //                 [user.id, user.email, user.pwd, user.display], function (err, result) {
    //                     req.login(user, function () {
    //                         res.redirect('/');
    //                     });
    //                 });
    //         });
    //     }
    // })
});
module.exports = router;