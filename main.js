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
    db.list(function (topic) {
        req.list = template.list(topic, '');
        next();
    });
});
//메인인덱스 출력
app.get('/', function (req, res) {
    db.list_board(0, 3, 'desc', (err, board) => {
        db.list_filter('desc', 0, 1, (topic) => {
            res.render('index', {
                title: 'IndexPage',
                list: req.list,
                login: auth.loginStatus(req),
                topic: topic[0],
                board: board
            });
        })
    });
});

app.get('/login', function (req, res) { res.render('./users/login'); });
app.get('/register', function (req, res) { res.render('./users/register') });




app.get('/boots', function (req, res) {
    res.render('boots');
});
app.use('/page', require('./router/page'));
app.use('/process', require('./router/process'));
app.use('/form', require('./router/form'));
app.use('/create', require('./router/create'));
app.use('/user', require('./router/user'));
app.use('/board', require('./router/board'));
app.use('/menu', require('./router/menu'));
//에러처리
// app.use(function (req, res, next) {
//     res.status(404).send('Sorry cant find that!');
// });
// app.use(function (err, req, res, next) {
//     res.status(500).send("파일 없음");
// })
app.listen(8000);