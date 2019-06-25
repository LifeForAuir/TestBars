var express = require('express');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
require('string.prototype.startswith');

var isInRole = require(libs + 'security_provider').isInRole;

var allowRoles = require(libs + 'security_provider').allowRoles;
//Проверяем доступность отображения кнопки
router.get('/:enabledAction', function (req, res) {
	log.info(req.originalUrl);
	var role = 'anon';
	if(req.session != undefined && req.session.role != undefined){
		role = req.session.role;
	}
	isInRole(role, 'btEnabled', req.params.enabledAction,
		function(err, allowed){
			log.info(allowed);
			if(!err){
				return res.json({
					status: 'OK',
					allowed: allowed
				});
			}
			else
			{
				return res.json({
					status: 'ERR',
					error: err,
					allowed: false
				});
			}
		});
});
//Получение всех ролей 
router.get('/', function (req, res) {
	log.info(req.originalUrl);
    return res.json({
		status: 'OK',
		data: allowRoles
	});
});

module.exports = router;