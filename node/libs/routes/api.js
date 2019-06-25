var express = require('express');

var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var db = require(libs + 'db/pg');

/* GET users listing. */
router.get('/', function (req, res) {
    res.json({
    	msg: 'API is running'
    });
});

router.get('/:id', function (req, res) {
    //console.log(req);
    res.json({
    	msg: 'API is running ' + req.params.id
    });
});


module.exports = router;
