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

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', './views');

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

//list 목록 불러오기
app.get('*', function (req, res, next) {
    db.list('', function (topic) {
        req.list = template.list(topic, '');
        next();
    });
});
//메인인덱스 출력
app.get('/', function (req, res) {
    res.render('index', {
        title: 'IndexPage',
        list: req.list,
        login: auth.loginStatus(req)
    });
});

app.get('/login', function (req, res) { res.render('./users/login'); });
app.get('/register', function (req, res) { res.render('./users/register') });


app.get('/menu/', function (req, res) {
    var page = req.params.page;
    var max = (page * 6) + (page - 1);
    var min = max - 6;
    db.list('limit 6', function (topic) {
        res.render('./contents/menu', {
            topic: topic,
            list: req.list,
            login: auth.loginStatus(req)
        });
    });
});

app.get('/board/:page', function (req, res) {
    var page = req.params.page;
    var max = page * 6;
    var min = max - 6;
    var prev = Number(page) - 1;
    if (prev === 0) {
        prev = 1;
    }
    var next = Number(page) + 1;
    console.log(max, min, prev, next);
    db.list_board(min, max, (err, board) => {
        res.render('./board/board.ejs', {
            board: board,
            list: req.list,
            prev: prev,
            next: next,
            login: auth.loginStatus(req),
            modal: req.flash().message
        });
    });

})
app.get('/boots', function (req, res) {
    res.render('boots');
});
app.use('/page', require('./router/page'));
app.use('/process', require('./router/process'));
app.use('/form', require('./router/form'));
app.use('/create', require('./router/create'));
app.use('/user', require('./router/user'));

//에러처리
// app.use(function (req, res, next) {
//     res.status(404).send('Sorry cant find that!');
// });
// app.use(function (err, req, res, next) {
//     res.status(500).send("파일 없음");
// })
app.listen(8000);