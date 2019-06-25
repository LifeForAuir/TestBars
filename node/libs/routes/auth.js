var express = require('express');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/pg');
require('string.prototype.startswith');

router.post('/', function(req, res) {
	var authCall = null;
    var fnName = '';
    if(req.body.tillAuth){
        fnName = 'fn_users_gettilltoken';
        authCall = db.fn_obj(fnName,[req.body.login, req.body.password, req.body.tillAuth]);
    }else{
        fnName = 'fn_users_gettoken';
        authCall = db.fn_obj(fnName,[req.body.login, req.body.password]);
    }
    
    authCall.then(function (data) {
        console.log(data);
        //console.log(data.fn_users_gettoken); // printing the data returned 
        return res.json({ 
				status: 'OK', 
				token:data[fnName] 
			});
    })
    .catch(function (error) {
        if(error.code.startsWith('HL'))
        {
            res.statusCode = 400;
				res.json({ 
                    status: error.code,
					msg: error.toString() 
				});
        } else {
            res.statusCode = 500;
				res.json({ 
                    status: 'ERR',
					msg: 'Server error' 
				});
        }
        log.error('Internal error(%d): %s', res.statusCode, error.toString());
    });
});

router.put('/', function(req, res) {
	db.fn_obj('fn_users_add',[req.body.login, 'user', req.body.password])
	.then(function (data) {
		return res.json({ 
				status: 'OK',
				token:data 
			});
	})
	.catch(function (error) {
		if(error.code.startsWith('HL'))
		{
			res.statusCode = 400;
				res.json({ 
					status: error.code,
					msg: error.toString() 
				});
		} else {
			res.statusCode = 500;
				res.json({ 
					status: 'ERR',
					msg: 'Server error' 
				});
		}
		log.error('Internal error(%d): %s', res.statusCode, error.toString());
	});
});

module.exports = router;