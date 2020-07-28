const express = require('express');
var router = express.Router();
const fs = require('fs');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
const db = require('../lib/db.js');
const shortid = require('shortid');


// db.defaults({ users: [] }).write();
//page 라우터 분리해서 관리

//생성 작업
router.post(`/create_process`, function (req, res) {
    var post = req.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        res.redirect(`/page/${title}`);
    });
});
//수정 폼
router.get(`/update/:pageID`, function (req, res) {
    if (auth.authIsOwner(req)) {
        var title = req.params.pageID;
        fs.readFile(`data/${title}`, 'utf8', function (err, data) {
            var description = `
            <form action="/page/update_process" method="POST">
                <input type="hidden" name="id"value="${title}">
                <input type="text" placeholder="title" name="title" value="${title}">
                <textarea id="editor" name="description">${data}</textarea>
                <input type="submit">
            </form>
            <input type="button" value="back" onclick="window.history.back()"></input>`;
            var printHTML = template.create(title, description);
            res.send(printHTML);
        });
    } else {
        req.flash('error', 'need login');
        res.redirect(`/page/login`);
    }
});
//수정 작업
router.post(`/update_process`, function (req, res) {
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function () {
        fs.writeFile(`data/${title}`, description, 'utf8', function () {
            res.redirect(`/page/${title}`);
        });
    });
});
//삭제 작업
router.post(`/delete_process`, function (req, res) {
    if (auth.authIsOwner(req)) {
        var post = req.body;
        var id = post.id;
        fs.unlink(`data/${id}`, function (err) {
            res.redirect(`/`);
        });
    } else {
        req.flash('error', 'need login');
        res.redirect(`/page/login`);
    }
});
//생성 폼
router.get(`/create`, function (req, res) {
    if (auth.authIsOwner(req)) {
        var title = "createPage";
        var description = `
        <form action="/page/create_process" method="POST">
            <input type="text" placeholder="title" name="title">
            <textarea id="editor" name="description"></textarea>
            <input type="submit">
        </form>
        <input type="button" value="back" onclick="window.history.back()"></input>`;
        var printHTML = template.create(title, description);
        res.send(printHTML);
    } else {
        req.flash('error', 'need login');
        res.redirect(`/page/login`);
    }
});
//회원가입 작업
router.post(`/register_process`, function (req, res) {
    var post = req.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var nickname = post.nickname;

    for (var i = 0; i < db.getState().users.length; i++) {
        if (db.getState().users[i].email === email) {
            req.flash('error', '이미 있는 이메일주소');
            res.redirect('/page/register');
        }
    }
    if (pwd != pwd2) {
        req.flash('error', 'Password must same');
        res.redirect('/page/register');
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
//회원가입 폼
router.get(`/register`, function (req, res) {
    var title = 'register';
    var fflash = req.flash();
    var feedback = '';
    if (fflash.error) {
        feedback = fflash.error[0];
    }
    var description = `
                <h1 style = "color:red">${feedback}</h1>
                <form action = "/page/register_process" method = "post">
                   <p><input type="text" placeholder="nickname" name="nickname"></p>
                   <p><input type="text" placeholder="email" name ="email"></p>
                   <p><input type="password" placeholder="password" name="pwd"></p>
                   <p><input type="password" placeholder="password" name="pwd2"></p>
                    <input type="submit" value="register">
                </form>
            `;
    var printHTML = template.html(title, req.list, description, "", `<a href="/page/login">login</a>`);
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
    var description = `
                <h1 style = "color:red">${feedback}</h1>
                <form action = "/login_process" method = "post">
                    <input type="text" placeholder="email" name ="email">
                    <input type="password" placeholder="password" name="pwd">
                    <input type="submit" value="login">
                </form>
            `;
    var printHTML = template.html(title, req.list, description, "", `<a href="/page/register">Register</a>`);
    res.send(printHTML);
});
//page 출력
router.get(`/:pageID`, function (req, res, next) {
    var title = req.params.pageID;
    var control =
        `<ul>
                <li><a href="/page/create">create</a></li>
                <li><a href="/page/update/${title}">update</a></li>
                <form action ="/page/delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                </form>
            </ul>`;
    fs.readFile(`./data/${title}`, 'utf8', function (err, description) {
        if (err) {
            next(err);
        } else {
            var printHTML = template.html(title, req.list, description, control, auth.loginStatus(req));
            res.send(printHTML);
        }
    });
});


module.exports = router;