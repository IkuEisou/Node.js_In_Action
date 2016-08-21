var register = require('./register');
var login = require('./login');
var entries = require('./entries');
var multer = require('multer');
var validate = require('../lib/middleware/validate');
var page = require('../lib/middleware/page');
var Entry = require('../lib/entry');

var upload = multer(); 

module.exports = function(app) {
	// app.get('/:page?', 
	// 	page(Entry.count, 5),
	// 	entries.list);
	app.get('/', 
		entries.list);
	app.get('/post', entries.form);
	app.post('/post', 
		validate.required('entry[title]'),
		validate.lengthAbove('entry[title]', 4),
		entries.submit);
  	app.get('/register', register.form);
  	app.post('/register', upload.array(), register.submit);
  	app.get('/login', login.form);
	app.post('/login', upload.array(), login.submit);
	app.get('/logout', login.logout);
};