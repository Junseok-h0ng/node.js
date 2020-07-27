module.exports = function (app) {
    //사용자 데이터
    var authData = {
        id: 'wnstjr',
        pwd: '1234',
        nickname: 'js'
    };
    const passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    //passport session 초기 실행
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    //passport session 재접속시 실행
    passport.deserializeUser(function (id, done) {
        done(null, authData);
    });
    //passport 로그인 접근
    passport.use(new LocalStrategy(
        {
            usernameField: 'id',
            passwordField: 'pwd'
        },
        function (username, password, done) {
            if (username === authData.id) {
                if (password === authData.pwd) {
                    return done(null, authData);
                } else {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
        }
    ));
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
