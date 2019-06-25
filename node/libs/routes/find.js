var express = require('express');
var router = express.Router();
var util = require('util');

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/pg');
require('string.prototype.startswith');
var guiDateFormat = 'yyyy-MM-dd HH24:MI:SS';
var maxRecords = 200;

var isInRole = require(libs + 'security_provider').isInRole;

router.get('/', function(req,res){
    filter = req.body;
    var cnd = [];
    var qwParams = {};
    console.log('get');
    console.log(filter);
	var where = '';
	if(filter.Onlyowner != '' && filter.Onlyowner != undefined && filter.Onlyowner == 1){
		where = 'WHERE Owner=\'' + req.session.id + '\' ';
	}
    
    var qwo = db.qw('select * from public.docs ' + where + ' limit ' + maxRecords);
        qwCount = db.qw('select count(*) from public.docs');
    qwCount
        .then(function (dataCount) {
            qwo.then(function (data) {
                    return res.json({ 
                        status: 'OK', 
                        data:data,
                        count: dataCount[0].count
                    });
                })
            .catch(function (error) {
                log.error(error);
                if(error.code.startsWith('HL'))
                {
                    res.statusCode = 400;
                        res.json({ 
                            status: 'ERR',
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
    })
    .catch(function (error) {
            log.error(error);
            if(error.code.startsWith('HL'))
            {
                res.statusCode = 400;
                    res.json({ 
                        status: 'ERR',
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

router.post('/', function(req,res){
    params = req.body;
    console.log('post');
    if(params == null || params.Name == null || params.Number == null || params.Description == null || params.Date == null){
		res.statusCode = 400;
		return res.json({ 
			status: 'ERR',
			msg: 'Не верные параметры' 
		});
	}
	var qwo = db.qw("UPDATE public.docs SET \"Name\"='" + params.Name + "', \"Date\"= to_date('" + params.Date + "','YYYY-MM-DD'), \"Number\"='" + params.Number + "', \"Description\"= '" + params.Description + "' WHERE \"ID\" =" + params.ID);
    qwo.then(function (data) {
				return res.json({ 
					status: 'OK'
				});
			})
		.catch(function (error) {
			log.error(error);
			if(error.code.startsWith('HL'))
			{
				res.statusCode = 400;
					res.json({ 
						status: 'ERR',
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

router.put('/', function(req,res){
    params = req.body;
    console.log('put');
    if(params == null || params.Name == null || params.Number == null || params.Description == null || params.Date == null){
		res.statusCode = 400;
		return res.json({ 
			status: 'ERR',
			msg: 'Не верные параметры' 
		});
	}
	
	
	var qwo = db.qw("INSERT INTO public.docs(\"Name\", \"Date\", \"Number\", \"Description\", \"Owner\") VALUES ('" + params.Name +"', to_date('" + params.Date + "','YYYY-MM-DD'), '" + params.Number + "', '" + params.Description + "', " +req.session.id +")");
    qwo.then(function (data) {
				return res.json({ 
					status: 'OK'
				});
			})
		.catch(function (error) {
			log.error(error);
			if(error.code.startsWith('HL'))
			{
				res.statusCode = 400;
					res.json({ 
						status: 'ERR',
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

router.delete('/', function(req,res){
    params = req.body;
    console.log('delete');
	var qwo = db.qw("DELETE FROM public.docs  WHERE \"ID\" =" + params.ID);
    qwo.then(function (data) {
				return res.json({ 
					status: 'OK'
				});
			})
		.catch(function (error) {
			log.error(error);
			if(error.code.startsWith('HL'))
			{
				res.statusCode = 400;
					res.json({ 
						status: 'ERR',
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