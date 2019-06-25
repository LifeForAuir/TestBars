var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var timeout = require('req-timeout');

var methodOverride = require('method-override');

var libs = process.cwd() + '/libs/';

var config = require('./config');
var log = require('./log')(module);

var r_api = require('./routes/api');
var r_auth = require('./routes/auth');
var r_find = require('./routes/find');
var r_role = require('./routes/role');

var db = require('./db/pg');
var secuter = require('./security_provider');
var customerrors = require('./core/http_errors')



require('string.prototype.startswith');

var app = express();

//app.use(timeout(10000));

app.set('views', process.cwd() + '/views')
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());

app.use(secuter.autificator);
app.use(secuter.authorizator);
app.use(customerrors.checkContinue);

app.use('/api/test', r_api);
app.use('/api/auth', r_auth);
app.use('/api/find', r_find);
app.use('/api/role', r_role);
app.use('/ui', express.static('ball'));


app.use(customerrors.handler_404);
app.use(customerrors.handler_etc);

module.exports = app;