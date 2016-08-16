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
          .use(errorHandler)
          .use(function (req, res) {
			res.setHeader('content-type', 'text/plain');
			res.write("You post:");
			res.end(JSON.stringify(req.body, null, 2));
          });

app.listen(3000);
