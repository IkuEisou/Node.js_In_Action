var connect = require('connect');

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

function setup(format){
	var regexp = /:(\w+)/g;
	return function _logger(req, res, next){
		var str = format.replace(regexp, function(match, property, offset, _str){
			console.log('match is '+ '"' + match + '"' );
			console.log('property is ' + '"' + property + '"');
			console.log('offset is ' + '"' + offset + '"');
			console.log('_str is ' + '"' + _str + '"');
			return req[property];
		});
		console.log(str);
		next();
	}
}

connect()
  // .use(logger)
  .use(setup(':method :url'))
  .use(hello)
  .listen(3000);
