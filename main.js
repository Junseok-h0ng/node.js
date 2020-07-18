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
                var description = "hello";
                var list = template.list(filelist);
                var printHTML = template.html(title, list, description);
                res.writeHead(200);
                res.end(printHTML);
            });
            //그외페이지 출력
        } else {
            fs.readdir(`./data`, function (err, filelist) {
                var list = template.list(filelist);
                fs.readFile(`./data/${queryData.id}`, `utf8`, function (err, description) {
                    var printHTML = template.html(title, list, description);
                    res.writeHead(200);
                    res.end(printHTML);
                });
            });
        }



    } else {
        res.writeHead(404);
        res.end('Not found');
    }


});

app.listen(8000);