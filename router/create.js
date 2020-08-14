const express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('create', { pageID: null });
});
router.get('/:pageID', function (req, res) {
    res.render('create', { pageID: req.params.pageID });
});

module.exports = router;