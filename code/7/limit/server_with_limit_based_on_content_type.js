var connect = require('connect');
var bodyParser = require('body-parser');

function errorHandler(err, req, res, next) {
  res.setHeader('content-type', 'text/plain');
  res.statusCode = err.status;
  var msg = "Error: " + err.message + "\nErrorCode："+ err.status ;
  console.log(msg);
  res.end(msg); 
}

function setupLimit(type, lmt) {
  // return function (req,res,next) {
  //   var ct = req.headers['content-type'] || '';
  //   console.log("Request type is " + ct);
  //   if (0 != ct.indexOf(type)) {
  //     return next();
  //   }
    switch(type){
      case 'application/json':
          return bodyParser.json({limit:lmt});
      case 'application/x-www-form-urlencoded':
          return bodyParser.urlencoded({extended:false, limit:lmt});          
    }
  // }  
}

var app = connect()
          .use(setupLimit('application/json', '1b'))
          // .use(bodyParser.json({limit:'1mb'}))
          .use(errorHandler)
          .use(function (req, res) {
            res.setHeader('content-type', 'text/plain');
            res.write("You post:");
            res.end(JSON.stringify(req.body, null, 2));
          });
app.listen(3000);
