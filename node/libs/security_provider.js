var db = require('./db/pg');
var log = require('./log')(module);

var acl = require('acl');
acl = new acl(new acl.memoryBackend());
acl.allow([
    {
        roles:['admin'],
        allows:[
            {
                resources:[
                    '/',
                    '/api/auth',
                    '/api/test',
                    '/ui/login.html',
                    '/ui/index.html',
                    '/ui/js',
                    '/ui/css',
                    '/ui/fonts',
                    '/ui/bower_components',
                    '/api/find',
					'/api/role'],
                permissions:['post', 'put', 'get', 'delete', 'head']
            },
            {   
                resources:[ 'btEnabled' ], 
                permissions:['addDocs', 'changeDocs', 'deleteDocs', 'viewUsers', 'changeUsers', 'addUsers', 'deleteUsers']
            }
        ]
    },
    {
        roles:['user'],
        allows:[
            {
                resources:[
					'/',
                    '/api/auth',
                    '/api/test',
                    '/ui/login.html',
                    '/ui/index.html',
                    '/ui/js',
                    '/ui/css',
                    '/ui/fonts',
                    '/ui/bower_components',
                    '/api/find',
					'/api/role'],
                permissions:['post', 'put', 'get', 'delete', 'head']
            },
            {   
                resources: [ 'btEnabled' ], 
                permissions: ['addDocs', 'changeDocs', 'deleteDocs' , 'addUsers', 'visibleCheckBoxOwner']
            }
        ]
    },
    {
        roles:['anon'],
        allows:[
            {resources:'/api/auth', permissions:'post'},
            {resources:'/api/auth', permissions:'put'},
			{resources:'/api/find', permissions:'put'},
			{resources:'/api/find', permissions:'post'},
			{resources:'/api/find', permissions:'delete'},
			{resources:'/api/find', permissions:'get'},
			{resources:'/api/role', permissions:'get'},
            {resources:'/ui/login.html', permissions:'get'},
			{resources:'/ui/index.html', permissions:'get'},
            {resources:'/ui/js', permissions:'get'},
            {resources:'/ui/css', permissions:'get'},
            {resources:'/ui/fonts', permissions:'get'},
            {resources:'/ui/bower_components', permissions:'get'} 
        ]
    }
]);


var authorizator = function(req, res, next){
    //console.log('sec.authorizator');
    var resource = req.originalUrl.split('?')[0].split('/').slice(0,3).join('/'),
        actions = req.method.toLowerCase();
        role = req.session ? req.session.role : 'anon';

    log.debug('test acl for: "%s" "%s" "%s"', resource, actions, role);
    acl.areAnyRolesAllowed(role, resource, actions, 
            function(err, allowed) { 
                if(err)
                {
                    log.error('acl error: %s', err);
                    res.status(500).send({ status: 'ERR', msg: 'Server error' });
                }
                else
                {
                    if(req.url == '/')
					{
						res.redirect('/ui/index.html');
					} else {
						next();
					}
                }
        });
};

var autificator = function(req, res, next){
    //console.log('sec.autificator');
    /*if(req.session){
        next();
    }*/
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies['token'];
    
    if (token) 
    {
        db.fn_obj('fn_users_getbytoken', token)
            .then(function (data) {
                req.session = data;
                next();
            })
            .catch(function (error) {
                log.error('Internal error: %s', error.toString());
                //console.log(req._parsedUrl);
                if(req.url == '/' || req.url == '/ui/index.html' || (req._parsedUrl.pathname == '/api/find' && req.method == 'GET'))
                {
                    log.debug('redirect to login page')
                    res.redirect('/ui/login.html');
                }
                else
                {
                    var m = req.url.match(/^\/ui\/.+/);
                    if(m != null)
                    {
                        req.session = null;
                        next();
                    }
                    else
                    {
                        var err = new Error();
                        if(error.code.startsWith('HL'))
                        {
                            err.status = 400;
                            err.code = error.code;
                            err.message = error.toString();
                            //res.status(400).send({ status: error.code, msg: error.toString() }).end();
                        }
                        else 
                        {
                            err.status = 500;
                            err.code = 'ERR';
                            err.message = 'Server error';
                            //res.status(500).send({ status: 'ERR', msg: 'Server error' }).end();
                        }
                        
                        next(err);
                    }
                }
            });
    }
    else
    {
        next();
    }
};

var isInRole = function(role, resource, actions, callback) {
    console.log('isInRole: %s %s %s', role, resource, actions);
    acl.areAnyRolesAllowed(role, resource, actions, callback);
}
module.exports.authorizator = authorizator;
module.exports.autificator = autificator;
module.exports.isInRole = isInRole;