var connect = require('connect');
var bodyParser = require('body-parser');

function errorHandler(err, req, res, next) {
  res.setHeader('content-type', 'text/plain');
  res.statusCode = err.status;
  var msg = "Error: " + err.message + "\nErrorCode："+ err.status ;
  console.log(msg);
  res.end(msg); 
}

function setupLimit(type, fn) {
  return function (req,res,next) {
    var ct = req.headers['content-type'] || '';
    if (0 != ct.indexOf(type)) {
      return next();
    }
    console.log(ct + " limit is set!");
    fn(req, res, next);
  }  
}

var app = connect()
          .use(setupLimit('application/json', bodyParser.json({limit:'32kb'})))
          .use(setupLimit('application/x-www-form-urlencoded', bodyParser.urlencoded({extended: false, limit:'64kb'})))
          .use(errorHandler)
          .use(function (req, res) {
            var ct = req.headers['content-type'] || '';
            console.log("Request type is " + ct);
            res.setHeader('content-type', 'text/plain');
            res.write("You post:");
            res.end(JSON.stringify(req.body, null, 2));
          });
app.listen(3000);
