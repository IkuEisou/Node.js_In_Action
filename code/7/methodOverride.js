var connect = require('connect');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override')

function edit(req, res, next) {
	if ('GET' != req.method) return next();
	res.setHeader('content-type', 'text/html');
	res.write('<form method="post" enctype="application/x-www-form-urlencoded">');
	res.write('<input type="hidden" name="_method" value="PUT"/>');
	res.write('<input type="text" name="user" value="Tobi"/>');
	res.write('<input type="submit" value="Update">');
	res.write('</form>');
	res.end();
}

function update(req, res, next) {
	console.log("req.body is " + JSON.stringify(req.body));
	if ('PUT' != req.method) return next();
	res.end('Update name to ' + req.body.user);
}

var app = connect()
    // .use(morgan('dev'))
	.use(bodyParser.urlencoded({extended: false}))
	.use(methodOverride(function(req, res){
  		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		    // look in urlencoded POST bodies and delete it 
		    var method = req.body._method
		    console.log("req.method is " + req.method);
		    delete req.body._method
		    return method
	  	}
	}))
	.use(edit)
	.use(update)
	.listen(3000);