var http = require('http');
var items = [];
var fs = require('fs');
var qs = require('querystring');
var parse = require('url').parse;
var join = require('path').join;
var root = __dirname;

var server = http.createServer(function(req, res){
  // console.log(req.url);
  // if ('/' == req.url) {
    switch (req.method) {
      case 'GET':
        show(req,res);
        break;
      case 'POST':
        add(req, res);
        break;
      default:
        badRequest(res);
    }
  // } else {
    // notFound(res);
  // }
});

server.listen(3000);

function show(req,res) {
  var url = parse(req.url);
  var path = join(root, url.pathname);
  console.log("Request path is " + path);

  fs.stat(path, function (err, stat) {
    if ( err && 'ENOENT' == err.code) {
      res.statusCode = 404;
      res.end('Not Found!')
    }else{
      // console.log(JSON.stringify(req.headers));
      filetype = url.pathname.split('.')[1];
      // console.log(filetype);
      switch (filetype){
        case 'html':
        case 'htm':
          type = 'text/html';
          break;
        case 'js':
          type = 'text/javascript'
          break;
        default:
          badRequest(res);

      }
      res.writeHead(200, {
        'Content-Type' : type,
        'Content-Length' : stat.size
      });
      var stream = fs.createReadStream(path);
      stream.pipe(res);
      stream.on('error', function(err){
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    }
  })
}

function add(req, res) {
  var body='';
  req.setEncoding('utf8');  
  req.on('data', function (chunk) {
    body += chunk;
    console.log("Request body is " + body);
  });
  req.on('end', function () {
    // var obj = qs.parse(body);
    items.push(body);
    res.writeHead(200, {
        'Content-Type' : 'text/plain'
        // 'Content-Length' : items.size
      });
    console.log(items.join());
    res.end(items.join());
  });
}

function badRequest(res) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bad Request');
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
}