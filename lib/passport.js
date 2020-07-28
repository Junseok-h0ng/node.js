const db = require('../lib/db.js');

module.exports = function (app) {
    const passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    //passport session 초기 실행
    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);
        done(null, user.id);
    });
    //passport session 재접속시 실행
    passport.deserializeUser(function (id, done) {
        console.log('deseriallizeUser', id, user);
        var user = db.get('users').find({ id: id }).value();
        done(null, user);
    });
    //passport 로그인 접근
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (email, password, done) {
            console.log('LocalStragtegy', email, password);
            var user = db.get('users').find({ email: email, pwd: password }).value();
            console.log(user);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Incorrect user infomation.'
                });
            }
        }
    ));
    //로그인 처리
    app.post(`/login_process`,
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/page/login',
            failureFlash: true
        }));
    //로그아웃 처리
    app.get(`/logout`, function (req, res) {
        req.logout();
        req.session.save(function () {
            res.redirect('/');
        });
    });

}
