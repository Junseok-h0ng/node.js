const express = require('express');
const router = express.Router();

const request = require('request');
const cheerio = require('cheerio');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('CP949', 'utf-8//translit//ignore');

router.get("/", function (req, res, next) {
    let url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn";

    request({ url, encoding: null }, function (error, response, body) {
        var htmlDoc = iconv.convert(body).toString();
        var resultArr = [];
        const $ = cheerio.load(htmlDoc);
        var colArr = $(".tit3");
        for (var i = 0; i < colArr.length; i++) {
            resultArr.push(colArr[i].children[1].attribs.title);
        }
        res.json(resultArr);
        console.log(resultArr);
    });
});

module.exports = router;