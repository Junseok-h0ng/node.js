const express = require('express');
var router = express.Router();
const fs = require('fs');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');

//수정 폼
router.get(`/update/:pageID`, function (req, res) {
    if (auth.authIsOwner(req)) {
        var title = req.params.pageID;
        fs.readFile(`data/${title}`, 'utf8', function (err, data) {
            var description = `
            <form action="/process/update" method="POST">
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
        res.redirect(`/form/login`);
    }
});
//생성 폼
router.get(`/create`, function (req, res) {
    if (auth.authIsOwner(req)) {
        var title = "createPage";
        var description = `
        <form action="/process/create" method="POST">
            <input type="text" placeholder="title" name="title">
            <textarea id="editor" name="description"></textarea>
            <input type="submit">
        </form>
        <input type="button" value="back" onclick="window.history.back()"></input>`;
        var printHTML = template.create(title, description);
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
    var description = `
                <h1 style = "color:red">${feedback}</h1>
                <form action = "/process/register" method = "post">
                   <p><input type="text" placeholder="nickname" name="nickname"></p>
                   <p><input type="text" placeholder="email" name ="email"></p>
                   <p><input type="password" placeholder="password" name="pwd"></p>
                   <p><input type="password" placeholder="password" name="pwd2"></p>
                    <input type="submit" value="register">
                </form>
            `;
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
    var description = `
                <h1 style = "color:red">${feedback}</h1>
                <form action = "/login_process" method = "post">
                    <input type="text" placeholder="email" name ="email">
                    <input type="password" placeholder="password" name="pwd">
                    <input type="submit" value="login">
                </form>
            `;
    var printHTML = template.html(title, req.list, description, "", `<a href="/form/register">Register</a>`);
    res.send(printHTML);
});

module.exports = router;