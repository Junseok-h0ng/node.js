var request = require('request');
var client_id = 'DDOSgX6C8RMykEbaGJab';
var client_secret = 'CN1xg6ehGf';
var api_url = 'https://openapi.naver.com/v1/datalab/search';
var request_body = {
    "startDate": "2018-08-01",
    "endDate": "2020-08-25",
    "timeUnit": "month",
    "keywordGroups": [
        {
            "groupName": "1",
            "keywords": [
                "1",
            ]
        },
        {
            "groupName": "영어",
            "keywords": [
                "영어",
                "english"
            ]
        }
    ],
    "device": "pc",
    "ages": [
        "1",
        "2"
    ],
    "gender": "f"
};

request.post({
    url: api_url,
    body: JSON.stringify(request_body),
    headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
        'Content-Type': 'application/json'
    }
},
    function (error, response, body) {
        console.log(JSON.parse(body).results[0]);
    }); 