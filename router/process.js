const express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../lib/auth.js');
const db = require('../lib/db.js');
const shortid = require('shortid');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: '111111',
    database: 'test'
});

//생성 작업
router.post(`/create`, function (req, res) {
    var post = req.body;
    var title = post.title;
    var description = post.description;
    // var id = shortid.generate();
    connection.query(`INSERT INTO topic(title,description,created,author_id) VALUES(?,?,NOW(),?)`,
        [title, description, 1],
        function (err, result) {
            if (err) throw err;
            res.redirect(`/page/${result.insertId}`);
        })
    // db.get('page').push({
    //     id: id,
    //     title: title,
    //     description: description,
    //     user_id: req.user.id
    // }).write();

});
//수정 작업
router.post(`/update`, function (req, res) {
    var post = req.body;
    console.log(post);
    // var id = post.id;
    // var title = post.title;
    // var description = post.description;
    // var page = db.get('page').find({ id: id }).value();
    // db.get('page').find({ id: id }).assign({
    //     title: title, description: description
    // }).write();

    connection.query('UPDATE topic SET title=?,description=?,author_id=1 WHERE id=?', [post.title, post.description, post.id],
        function (err, result) {
            res.redirect(`/page/${post.id}`);
        })
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
    console.log(id);
    connection.query('DELETE FROM topic WHERE id = ?', [id], function (err, result) {
        res.redirect('/');
    })
    // var page = db.get('page').find({ id: id }).value();
    //페이지 주인 과 접속한 유저 일치 확인 

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
        bcrypt.hash(pwd, 10, function (err, hash) {
            var user = {
                id: shortid.generate(),
                email: email,
                pwd: hash,
                nickname: nickname
            }
            db.get('users').push(user).write();
            req.login(user, function (err) {
                return res.redirect('/');
            });

        });
    }
});
module.exports = router;