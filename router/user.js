const express = require('express');
const db = require('../lib/mysql');
const auth = require('../lib/auth');
const bcrypt = require('bcrypt');
const { render } = require('ejs');
var router = express.Router();

function renderPage(req, res, mod, topics) {
    var userID = req.params.userID;
    res.render('./users/user', {
        userID: userID,
        list: req.list,
        login: auth.loginStatus(req),
        mod: mod,
        disabled: userType(req),
        modal: req.flash().message,
        topics: topics
    });
}
function userType(req) {
    if (req.user.type != null) {
        return 'disabled'
    }
}
function delete_user(req, res, userID) {
    req.logout();
    req.session.save(function () {
        db.delete_user(userID);
    });
    res.redirect('/');
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
router.get('/list/:userID', function (req, res) {
    var userID = req.params.userID;
    db.content_user_filter(userID, (err, topics) => {
        if (topics) {
            renderPage(req, res, 'content_filter', topics);
        }
    });

})

router.post('/delete/:userID', function (req, res) {
    var userID = req.params.userID;
    var pwd = req.body.pwd;
    if (pwd === 'EXTERNAL') { delete_user(req, res, userID); return; }
    db.userID(userID, function (err, user) {
        bcrypt.compare(pwd, user[0].pwd, function (err, result) {
            console.log(pwd, user[0].pwd, result);
            if (result) {
                delete_user(req, res, userID);
            } else {
                req.flash('message', '잘못된 패스워드 입력 입니다.')
                res.redirect(`/user/delete/${userID}`)
            }
        });
    });

});
router.post('/edit/:userID', function (req, res) {
    var post = req.body;
    var userID = req.params.userID;
    var oldpwd = post.old_pwd;
    var newpwd = post.new_pwd;
    var newpwd2 = post.new_pwd2;
    console.log(post);
    db.userID(userID, function (err, user) {
        bcrypt.compare(oldpwd, user[0].pwd, function (err, result) {
            if (result) {
                if (newpwd === newpwd2) {
                    bcrypt.hash(newpwd, 10, function (err, hash) {
                        db.change_password(hash, userID);
                    });
                    req.flash('message', '패스워드 변경 완료');
                } else {
                    req.flash('message', '잘못된 패스워드 재입력 입니다.');
                }
            } else {
                req.flash('message', '잘못된 패스워드 입력 입니다.');
            }
            res.redirect(`/user/edit/${userID}`);
        });
    })
});

module.exports = router;