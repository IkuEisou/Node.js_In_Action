var connect = require('connect');
var bodyParser = require('body-parser');

function errorHandler(err, req, res, next) {
	res.setHeader('content-type', 'text/plain');
	res.statusCode = err.status;
	var msg = "Error: " + err.message + "\nErrorCode："+ err.status ;
	console.log(msg);
	res.end(msg); 
}

var app = connect()
          .use(bodyParser.json({limit:'1b'}))
          .use(errorHandler);

app.listen(3000);
