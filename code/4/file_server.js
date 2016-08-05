var http =  require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var root = __dirname;
var formidable = require('formidable');
var io = require('socket.io');

var server = http.createServer(function(req, res){
  switch (req.method) {
      case 'GET':
        show(req,res);
        break;
      case 'POST':
        upload(req, res);
        break;
  }
});

server.listen(3000);

function show(req, res) {
  var url = parse(req.url);
  var path = join(root, url.pathname);
  fs.stat(path, function(err, stat){
    if (err) {
      if ('ENOENT' == err.code) {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    } else {
      // res.setHeader('Content-Length', stat.size);
      res.writeHead(200, {
        'Content-Type' : 'text/html',
        'Content-Length' : stat.size
      });
      var stream = fs.createReadStream(path);
      stream.pipe(res);
      stream.on('error', function(err){
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    }
  });
}

function upload(req, res) {
  if (!isFormData(req)) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }
  
  var form = new formidable.IncomingForm();
  form.on('field', function (field, value) {
    console.log(field);
    console.log(value);
  });

  form.on('file', function (name, file) {
    console.log(name);
    console.log(file);    
  });

  form.on('end', function () {
    res.end('upload complete!');    
  });

  form.on('progress', function (bytesReceived, bytesExpected) {
    var percent = Math.floor(bytesReceived / bytesExpected * 100);
    console.log(percent);
    var serv_io = io.listen(server);
    serv_io.sockets.on('connection', function (socket) {
      socket.emit('message', percent);
    });
  });
  form.parse(req);
}

function isFormData(req) {
  var type = req.headers['content-type'] || '';
  return 0 == type.indexOf('multipart/form-data');
}