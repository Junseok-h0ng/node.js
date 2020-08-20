const bcrypt = require('bcrypt');
const shortid = require('shortid');
const db = require('../lib/mysql');

module.exports = function (app) {
    const passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy,
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        NaverStrategy = require('passport-naver').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    //passport session 초기 실행
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    //passport session 재접속시 실행
    passport.deserializeUser(function (id, done) {
        db.userID(id, function (err, user) {
            done(null, user[0]);
        });
    });
    //passport 로그인 접근
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            db.user(email, function (err, user) {
                if (user[0]) {
                    bcrypt.compare(password, user[0].pwd, function (err, result) {
                        if (result) {
                            return done(null, user[0]);
                        } else {
                            return done(null, false, {
                                message: '잘못된 패스워드'
                            });
                        }
                    })
                } else {
                    return done(null, false, {
                        message: '잘못된 이메일'
                    });
                }
            })

        }
    ));
    //google passport
    var googleCredentials = require('../config/google.json');
    passport.use(new GoogleStrategy({
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0]
    },
        function (accessToken, refreshToken, profile, done) {
            var email = profile.emails[0].value;
            db.user(email, function (err, user) {
                if (user[0] && user[0].type === 'Google') {
                    return done(null, user[0]);
                } else {
                    var user = {
                        id: shortid.generate(),
                        email: email,
                        pwd: null,
                        type: 'Google',
                        display: profile.displayName
                    }
                    db.register(user);
                    return done(null, user);
                }
            });
        }
    ));
    app.get('/auth/google',
        passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/form/login' }),
        function (req, res) {
            res.redirect('/');
        });
    //naver passport
    var naverCredentials = require('../config/naver.json');
    passport.use(new NaverStrategy({
        clientID: naverCredentials.web.client_id,
        clientSecret: naverCredentials.web.client_secret,
        callbackURL: naverCredentials.web.redirect_uris[0]
    },
        function (accessToken, refreshToken, profile, done) {
            var email = profile.emails[0].value;
            db.user(email, function (err, user) {
                if (user[0] && user[0].type === 'Naver') {
                    return done(null, user[0]);
                } else {
                    var user = {
                        id: shortid.generate(),
                        email: email,
                        pwd: null,
                        type: 'Naver',
                        display: profile.displayName
                    }
                    db.register(user);
                    return done(null, user);
                }
            });
        }
    ));
    app.route('/auth/naver')
        .get(passport.authenticate('naver', {
            failureRedirect: '/login'
        }));
    // creates an account if no account of the new user
    app.route('/auth/naver/callback')
        .get(passport.authenticate('naver', {
            failureRedirect: '/login'
        }),
            function (req, res) {
                res.redirect('/');
            });
    //로그인 처리
    app.post(`/login_process`,
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
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
