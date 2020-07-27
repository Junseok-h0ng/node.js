const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template.js');
const auth = require('./lib/auth.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
var app = express();

app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'asdfagasg',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
app.use(flash());

var authData = {
    id: 'wnstjr',
    pwd: '1234',
    nickname: 'js'
}

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
    console.log('deserializeUser', id);
    done(null, authData);
});
//passport 로그인 접근
passport.use(new LocalStrategy(
    {
        usernameField: 'id',
        passwordField: 'pwd'
    },
    function (username, password, done) {
        console.log('Localstrategy', username, password);
        if (username === authData.id) {
            console.log(1);
            if (password === authData.pwd) {
                console.log(2);
                return done(null, authData);
            } else {
                console.log(3);
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
        } else {
            console.log(4);
            return done(null, false, {
                message: 'Incorrect username.'
            });
        }
    }

));
//passport 로그인 처리
app.post(`/login_process`,
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
app.get(`/logout`, function (req, res) {
    req.logout();
    req.session.save(function () {
        res.redirect('/');
    });
});
//list 목록 불러오기
app.get('*', function (req, res, next) {
    fs.readdir(`./data`, function (err, filelist) {
        req.list = template.list(filelist);
        next();
    });
});
//메인인덱스 출력
app.get('/', function (req, res) {
    console.log(req.user);
    var title = "indexPage";
    var description = `<img src ="/img/hello.jpg" style="width:300px; display:block;">`
    var printHTML = template.html(title, req.list, description, '', auth.loginStatus(req));
    res.send(printHTML);
});
//page 출력
app.get(`/page/:pageID`, function (req, res, next) {
    var title = req.params.pageID;
    var control =
        `<ul>
                <li><a href="/create">create</a></li>
                <li><a href="/update/${title}">update</a></li>
                <form action ="/delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                </form>
            </ul>`;

    fs.readFile(`data/${title}`, 'utf8', function (err, description) {
        if (err) {
            next(err);
        } else {
            var printHTML = template.html(title, req.list, description, control, auth.loginStatus(req));
            res.send(printHTML);
        }
    });

});
//생성 폼
app.get(`/create`, function (req, res) {
    if (authIsOwner(req.session.user)) {
        var title = "createPage";
        var description = `
        <form action="./create_process" method="POST">
            <input type="text" placeholder="title" name="title">
            <textarea id="editor" name="description"></textarea>
            <input type="submit">
        </form>
        <input type="button" value="back" onclick="window.history.back()"></input>`;
        var printHTML = template.create(title, description);
        res.send(printHTML);
    } else {
        res.redirect(`/login`);
    }

});
//생성 작업
app.post(`/create_process`, function (req, res) {
    var post = req.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        res.redirect(`/page/${title}`);
    });
});
//수정 폼
app.get(`/update/:pageID`, function (req, res) {
    if (authIsOwner(req.session.user)) {
        var title = req.params.pageID;
        fs.readFile(`data/${title}`, 'utf8', function (err, data) {
            var description = `
            <form action="/update_process" method="POST">
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
        res.redirect(`/login`);
    }

});
//수정 작업
app.post(`/update_process`, function (req, res) {
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function () {
        fs.writeFile(`data/${title}`, description, 'utf8', function () {
            res.redirect(`page/${title}`);
        });
    });
});
//삭제 작업
app.post(`/delete_process`, function (req, res) {
    if (authIsOwner(req.session.user)) {
        var post = req.body;
        var id = post.id;
        fs.unlink(`data/${id}`, function (err) {
            res.redirect(`/`);
        });
    } else {
        res.redirect(`/login`);
    }

});
//로그인 폼
app.get(`/login`, function (req, res) {
    var title = 'login';
    var fflash = req.flash();
    var feedback = '';
    if (fflash.error) {
        feedback = fflash.error[0];
    }
    var description = `
            <h1 style = "color:red">${feedback}</h1>
            <form action = "/login_process" method = "post">
                <input type="text" placeholder="id" name ="id">
                <input type="password" placeholder="password" name="pwd">
                <input type="submit">
            </form>
        `;
    var printHTML = template.html(title, req.list, description, "", '');
    res.send(printHTML);
});
//에러처리
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.use(function (err, req, res, next) {
    res.status(500).send("파일 없음");
})
app.listen(8000);

// app = http.createServer((req, res) => {
//     var _url = req.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;
//     var title = queryData.id;

//     console.log(queryData, pathname);
//     if (pathname === '/') {
//         //메인페이지 출력
//         if (queryData.id === undefined) {
//             fs.readdir(`./data`, function (err, filelist) {
//                 var title = "indexPage";
//                 var description = "wellcome";
//                 var list = template.list(filelist);
//                 var control = '';
//                 var printHTML = template.html(title, list, description, control);
//                 res.writeHead(200);
//                 res.end(printHTML);
//             });
//         } else {
//             //그외페이지 출력
//             fs.readdir(`./data`, function (err, filelist) {
//                 var list = template.list(filelist);
//                 var control = `
//                 <ul>
//                     <li><a href="/create">create</a></li>
//                     <li><a href="/update?id=${title}">update</a></li>
//                     <form action ="/delete_process" method="post">
//                         <input type="hidden" name="id" value="${title}">
//                         <input type="submit" value="delete">
//                     </form>
//                 </ul>`
//                 fs.readFile(`./data/${title}`, `utf8`, function (err, description) {
//                     var printHTML = template.html(title, list, description, control);
//                     res.writeHead(200);
//                     res.end(printHTML);
//                 });
//             });
//         }
//     } else if (pathname === '/create') {
//         //새로운페이지 페이지 생성
//         fs.readdir(`./data`, function (err, filelist) {
//             var title = "createPage";
//             var description = `
//             <form action="./create_process" method="POST">
//                 <p><input type="text" placeholder="title" name="title"></p>
//                 <p><textarea placeholder="description" name="description"></textarea></p>
//                 <p><input type="submit"></p>
//             </form>`;
//             var list = template.list(filelist);
//             var control = '';
//             var printHTML = template.html(title, list, description, control);
//             res.writeHead(200);
//             res.end(printHTML);
//         });
//     } else if (pathname === '/create_process') {
//         //새페이지 생성 작업
//         var body = ''
//         req.on('data', function (data) {
//             body = body + data;
//         });
//         req.on('end', function () {
//             var post = qs.parse(body);
//             var title = post.title;
//             var description = post.description;
//             fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
//                 res.writeHead(302, { Location: `/?id=${title}` });
//                 res.end();
//             })
//         });
//     } else if (pathname === '/update') {
//         //기존페이지 갱신 페이지 생성
//         fs.readdir(`./data`, function (err, filelist) {
//             fs.readFile(`./data/${title}`, 'utf8', function (err, description) {
//                 var description = `
//                 <form action="./update_process" method="POST">
//                     <p><input type="hidden" name="id" value="${title}"></p>
//                     <p><input type="text" placeholder="title" value ="${title}" name="title"></p>
//                     <p><textarea placeholder="description" name="description">${description}</textarea></p>
//                     <p><input type="submit"></p>
//                 </form>`;
//                 var list = template.list(filelist);
//                 var control = '';
//                 var printHTML = template.html(title, list, description, control);
//                 res.writeHead(200);
//                 res.end(printHTML);
//             });
//         });
//     } else if (pathname === '/update_process') {
//         //기존페이지 갱신 작업
//         var body = ''
//         req.on('data', function (data) {
//             body = body + data;
//         });
//         req.on('end', function () {
//             var post = qs.parse(body);
//             var id = post.id;
//             var title = post.title;
//             var description = post.description;
//             fs.rename(`./data/${id}`, `./data/${title}`, function (err) {
//                 fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
//                     res.writeHead(302, { Location: `/?id=${title}` });
//                     res.end();
//                 });
//             });
//         });
//     } else if (pathname === '/delete_process') {
//         var body = '';
//         req.on('data', function (data) {
//             body = body + data;
//         });
//         req.on('end', function () {
//             var post = qs.parse(body);
//             var id = post.id;
//             fs.unlink(`./data/${id}`, function () {
//                 res.writeHead(302, { Location: `/` });
//                 res.end();
//             });
//         });
//     } else {
//         res.writeHead(404);
//         res.end('Not found');
//     }


// });
