const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template.js');

var app = http.createServer((req, res) => {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    console.log(queryData, pathname);
    if (pathname === '/') {
        //메인페이지 출력
        if (queryData.id === undefined) {
            fs.readdir(`./data`, function (err, filelist) {
                var title = "indexPage";
                var description = "wellcome";
                var list = template.list(filelist);
                var control = '';
                var printHTML = template.html(title, list, description, control);
                res.writeHead(200);
                res.end(printHTML);
            });
        } else {
            //그외페이지 출력
            fs.readdir(`./data`, function (err, filelist) {
                var list = template.list(filelist);
                var control = `
                <ul>
                    <li><a href="/create">create</a></li>
                    <li><a href="/update?id=${title}">update</a></li>
                    <form action ="/delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>
                </ul>`
                fs.readFile(`./data/${title}`, `utf8`, function (err, description) {
                    var printHTML = template.html(title, list, description, control);
                    res.writeHead(200);
                    res.end(printHTML);
                });
            });
        }
    } else if (pathname === '/create') {
        //새로운페이지 페이지 생성
        fs.readdir(`./data`, function (err, filelist) {
            var title = "createPage";
            var description = `
            <form action="./create_process" method="POST">
                <p><input type="text" placeholder="title" name="title"></p>
                <p><textarea placeholder="description" name="description"></textarea></p>
                <p><input type="submit"></p>
            </form>`;
            var list = template.list(filelist);
            var control = '';
            var printHTML = template.html(title, list, description, control);
            res.writeHead(200);
            res.end(printHTML);
        });
    } else if (pathname === '/create_process') {
        //새페이지 생성 작업
        var body = ''
        req.on('data', function (data) {
            body = body + data;
        });
        req.on('end', function () {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
                res.writeHead(302, { Location: `/?id=${title}` });
                res.end();
            })
        });
    } else if (pathname === '/update') {
        //기존페이지 갱신 페이지 생성
        fs.readdir(`./data`, function (err, filelist) {
            fs.readFile(`./data/${title}`, 'utf8', function (err, description) {
                var description = `
                <form action="./update_process" method="POST">
                    <p><input type="hidden" name="id" value="${title}"></p>
                    <p><input type="text" placeholder="title" value ="${title}" name="title"></p>
                    <p><textarea placeholder="description" name="description">${description}</textarea></p>
                    <p><input type="submit"></p>
                </form>`;
                var list = template.list(filelist);
                var control = '';
                var printHTML = template.html(title, list, description, control);
                res.writeHead(200);
                res.end(printHTML);
            });
        });
    } else if (pathname === '/update_process') {
        //기존페이지 갱신 작업
        var body = ''
        req.on('data', function (data) {
            body = body + data;
        });
        req.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`./data/${id}`, `./data/${title}`, function (err) {
                fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
                    res.writeHead(302, { Location: `/?id=${title}` });
                    res.end();
                });
            });
        });
    } else if (pathname === '/delete_process') {
        var body = '';
        req.on('data', function (data) {
            body = body + data;
        });
        req.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`./data/${id}`, function () {
                res.writeHead(302, { Location: `/` });
                res.end();
            });
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }


});

app.listen(8000);