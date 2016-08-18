var serveStatic = require('serve-static');
var connect = require('connect');
var compression = require('compression');
var directory = require('serve-index');

var app = connect()
	.use(compression())
	.use(directory('public'))
 	.use(serveStatic('public'))
	.listen(3000);