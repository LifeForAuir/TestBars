var log = require('../log')(module);

var handler_404 = function(req, res, next){
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({ 
    	error: 'Not found' 
    });
    res.end();
};

var handler_etc = function(err, req, res, next){
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    console.log(err);
    res.json({
        status: err.code,
    	error: err.message
    });
    console.log('write end')
    res.end();
};

module.exports.checkContinue = function(req, res, next){ 
    if (req.checkContinue){
        console.log('writeContinue');
        res.writeContinue();
    }
    next();
};

module.exports.handler_404 = handler_404;
module.exports.handler_etc = handler_etc;