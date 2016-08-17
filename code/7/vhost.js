var connect = require('connect');
var vhost = require('vhost');
var http = require('http');
var morgan = require('morgan');

var app = connect();
app.use(morgan('dev'));

var fooApp = connect();
fooApp.use(morgan('dev'));
fooApp.use(function(req, res) {
    res.end('hello fooApp');
});

var barApp = connect();
barApp.use(morgan('dev'));
barApp.use(function(req, res) {
    res.end('hello barApp');
});

app.use(vhost('foo.com', fooApp));
app.use(vhost('bar.com', barApp));
app.use(function(req, res) {
    res.end(JSON.stringify(req.headers.host));
});
app.listen(3000);
