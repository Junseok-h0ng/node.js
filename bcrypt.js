const bcrypt = require('bcrypt');
const { has } = require('lodash');
const saltRound = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rd';
const someOtherPlaintextPassword = '111112';

bcrypt.hash(myPlaintextPassword, saltRound, function (err, hash) {
    console.log(hash);
    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
        console.log('my password', result);
    });
    bcrypt.compare(someOtherPlaintextPassword, hash, function (err, result) {
        console.log('other password', result);
    })
});
