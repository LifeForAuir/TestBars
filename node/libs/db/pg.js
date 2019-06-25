var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);

var libs = process.cwd() + '/libs/';

var log = require(libs + 'log')(module);
var config = require(libs + 'config');

var db = pgp(config.get('pg'));

var fn_obj = function(fn_name, fn_params){
    return db.func(fn_name, fn_params, pgp.queryResult.one);
}

var proc = function(fn_name, fn_params){
    return db.func(fn_name, fn_params, pgp.queryResult.none);
}

var qw = function(qw, args, r){
    //log.debug('qw %s [%s]', qw, args);
    return db.query(qw, args, r);
}

module.exports.fn_obj = fn_obj;
module.exports.proc = proc;
module.exports.qw = db.query;
module.exports.qrm = pgp.queryResult;
//module.exports.pgp = db;

module.exports.cn = db;
