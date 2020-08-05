const db = require('../lib/db.js');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: '111111',
    database: 'test'
});
connection.connect();

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
        // var user = db.get('users').find({ id: id }).value();
        connection.query('SELECT * FROM user WHERE id = ?', [id], function (err, user) {
            done(null, user[0]);
        })

    });
    //passport 로그인 접근
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (email, password, done) {
            connection.query('SELECT * FROM user WHERE email = ?', [email], function (err, user) {
                if (user[0]) {
                    if (password === user[0].pwd) {
                        return done(null, user[0]);
                    } else {
                        return done(null, false, {
                            message: 'Wrong password'
                        });
                    }
                } else {
                    return done(null, false, {
                        message: 'Wrong ID'
                    });
                }
            });

            // var user = db.get('users').find({ email: email }).value();
            // if (user) {
            //     bcrypt.compare(password, user.pwd, function (err, result) {
            //         if (result) {
            //             return done(null, user);
            //         } else {
            //             return done(null, false, {
            //                 message: 'Wrong Password'
            //             });
            //         }
            //     })
            // } else {
            //     return done(null, false, {
            //         message: 'Wrong Email'
            //     });
            // }
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
            var user = db.get('users').find({ email: email }).value();
            if (user) {
                user.googleId = profile.id;
                db.get('users').find({ id: user.id }).assign(user).write();
            } else {
                user = {
                    id: shortid.generate(),
                    email: email,
                    nickname: profile.displayName,
                    googleId: profile.id
                }
                db.get('users').push(user).write();
            }
            done(null, user);
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
            var user = db.get('users').find({ email: email }).value();
            if (user) {
                user.naverId = profile.id;
                db.get('users').find({ id: user.id }).assign(user).write();
            } else {
                user = {
                    id: shortid.generate(),
                    email: email,
                    nickname: profile.displayName,
                    naverId: profile.id
                }
                db.get('users').push(user).write();
            }
            done(null, user);
        }
    ));
    app.route('/auth/naver')
        .get(passport.authenticate('naver', {
            failureRedirect: '/form/login'
        }));
    // creates an account if no account of the new user
    app.route('/auth/naver/callback')
        .get(passport.authenticate('naver', {
            failureRedirect: '/form/login'
        }),
            function (req, res) {
                res.redirect('/');
            });
    //로그인 처리
    app.post(`/login_process`,
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/form/login',
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
