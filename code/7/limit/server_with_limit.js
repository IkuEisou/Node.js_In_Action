var connect = require('connect');
var bodyParser = require('body-parser');

function errorHandler(err, req, res, next) {
	res.setHeader('content-type', 'application/json');
	res.statusCode = err.status;
  var msg = "error: " + err.message + "\nerror statusode："+ err.status ;

  console.log(msg);
  res.setHeader('content-type', 'text/plain');
	res.end(msg); 
}

var app = connect()
          .use(bodyParser.json({limit:'1b'}))
          .use(errorHandler);

app.listen(3000);
