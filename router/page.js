const express = require('express');
var router = express.Router();
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
// const db = require('../lib/db.js');

const db = require('../lib/mysql');

router.get(`/:pageID`, function (req, res, next) {
    db.page(req, function (err, topic) {
        var title = topic[0].title;
        var description = topic[0].description;
        var control =
            `<p>by ${topic[0].displayname}</p>
        <ul>
            <li><a href="/form/create">create</a></li>
            <li><a href="/form/update/${req.params.pageID}">update</a></li>
            <form action ="/process/delete" method="post">
                <input type="hidden" name="id" value="${req.params.pageID}">
                <input type="submit" value="delete">
            </form>
        </ul>`;
        var printHTML = template.html(title, req.list, description, control, auth.loginStatus(req));
        res.send(printHTML);
    });
})
// connection.query('SELECT * FROM topic LEFT JOIN users ON topic.user_id = users.id WHERE topic.id = ?',
//     [req.params.pageID], function (err, topic) {
//         var title = topic[0].title;
//         var description = topic[0].description;
//         var control =
//             `<p>by ${topic[0].displayname}</p>
//     <ul>
//         <li><a href="/form/create">create</a></li>
//         <li><a href="/form/update/${req.params.pageID}">update</a></li>
//         <form action ="/process/delete" method="post">
//             <input type="hidden" name="id" value="${req.params.pageID}">
//             <input type="submit" value="delete">
//         </form>
//     </ul>`;
//         var printHTML = template.html(title, req.list, description, control, auth.loginStatus(req));
//         res.send(printHTML);
//     });


module.exports = router;