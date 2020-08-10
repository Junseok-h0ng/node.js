const template = require('./lib/template.js');
const auth = require('./lib/auth.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const db = require('./lib/mysql');
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

//passport 실행
require('./lib/passport.js')(app);
//페이지 라우터
const pageRouter = require('./router/page');
//프로세스 라우터
const processRouter = require('./router/process');
//폼 라우터
const formRouter = require('./router/form');

//list 목록 불러오기
app.get('*', function (req, res, next) {
    db.getList(function (topic) {
        req.list = template.list(topic);
        next();
    });
});
//메인인덱스 출력
app.get('/', function (req, res) {
    var title = "indexPage";
    var description = `<img src ="/img/hello.jpg" style="width:300px; display:block;">`
    var printHTML = template.html(title, req.list, description, false, auth.loginStatus(req));
    res.send(printHTML);
});
app.use('/page', pageRouter);
app.use('/process', processRouter);
app.use('/form', formRouter);

//에러처리
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.use(function (err, req, res, next) {
    res.status(500).send("파일 없음");
})
app.listen(8000);