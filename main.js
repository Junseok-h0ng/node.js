const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


function authIsOwner(req) {
    var isOwner = false;
    var id = req.cookies.id;
    var password = req.cookies.password;
    if (id === "wnstjr" && password === "1234") {
        isOwner = true;
    }
    return isOwner;
}

//list 목록 불러오기
app.get('*', function (req, res, next) {
    fs.readdir(`./data`, function (err, filelist) {
        req.list = template.list(filelist);
        next();
    });
});
//메인인덱스 출력
app.get('/', function (req, res) {
    var title = "indexPage";
    var description = `<img src ="/img/hello.jpg" style="width:300px; display:block;">`
    var printHTML = template.html(title, req.list, description, '', authIsOwner(req));

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

            var printHTML = template.html(title, req.list, description, control, authIsOwner(req));
            res.send(printHTML);
        }
    });

});
//생성 폼
app.get(`/create`, function (req, res) {
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
    var title = req.params.pageID;
    fs.readFile(`data/${title}`, 'utf8', function (err, data) {
        var description = `
        <form action="/update_process" method="POST">
            <input type="hidden" value="${title}">
            <input type="text" placeholder="title" name="title" value="${title}">
            <textarea id="editor" name="description">${data}</textarea>
            <input type="submit">
        </form>
        <input type="button" value="back" onclick="window.history.back()"></input>`;
        var printHTML = template.create(title, description);
        res.send(printHTML);
    });
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
    var post = req.body;
    var id = post.id;
    fs.unlink(`data/${id}`, function (err) {
        res.redirect(`/`);
    });
});
app.get(`/login`, function (req, res) {
    var title = "Login";
    var description = `
        <form action = "/login_process" method = "post">
            <input type="text" placeholder="id" name ="id">
            <input type="password" placeholder="password" name="password">
            <input type="submit">
        </form>
    `;
    var printHTML = template.html(title, req.list, description, "", '');
    res.send(printHTML);
});
app.post(`/login_process`, function (req, res) {
    var post = req.body;
    res.cookie('id', `${post.id}`);
    res.cookie('password', `${post.password}`);
    res.redirect('/');
});
app.get(`/logout_process`, function (req, res) {
    res.clearCookie('id');
    res.clearCookie('password');
    res.redirect('/');
});

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
