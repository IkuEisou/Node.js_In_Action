var connect = require('./limit/node_modules/connect');
var qs = require('qs');
var parse = require('url').parse;

function query(options) {
	return function query(req, res, next) {
		console.log("req.url is " + req.url);
		if (!req.query) {
			req.query = ~req.url.indexOf('?')
			? qs.parse(parse(req.url).query, options) : {};
			// console.log("parse(req.url) is  " + JSON.stringify(parse(req.url)));
			console.log("parse(req.url).query is  " + parse(req.url).query);
		}
		next();
	}
}
var app = connect()
	.use(query())
	.use(function (req, res, next) {
		res.setHeader('content-type', 'application/json');
		res.end(JSON.stringify(req.query));
		console.log("qs.parse(parse(req.url).query) is  " +
		 JSON.stringify(req.query));
	});
app.listen(3000);
