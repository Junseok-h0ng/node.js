const express = require('express');
const router = express.Router();

const request = require('request');
const cheerio = require('cheerio');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('CP949', 'utf-8//translit//ignore');
module.exports = {
    keyword: function (callback) {
        let url = "https://www.naver.com/srchrank?frm=main&ag=20s&gr=0&ma=0&si=0&en=0&sp=0"
        request({ url }, function (err, response, body) {
            var keyword = [];
            for (var i = 0; i < 10; i++) {
                keyword.push(JSON.parse(body).data[i]);
            }
            return callback(null, keyword);
        });
    }
}