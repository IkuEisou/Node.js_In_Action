var connect = require('connect');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');

var app = connect()
  .use(favicon(__dirname + '/public/favicon.ico'))
  .use(cookieParser('keyboard cat'))
  .use(session({
      secret: 'keyboard cat', 
      resave: true, 
      cookie: { maxAge: 60000 },
      saveUninitialized: true
  }))
  .use(function(req, res, next){
    var sess = req.session;
    console.log("req.session is " +　JSON.stringify(req.session));
    if (sess.views) {
      sess.views++;
      res.setHeader('Content-Type', 'text/html');
      res.write('<p>views: ' + sess.views + '</p>');
      res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
      res.end();
      console.log("sess.views is " +　sess.views);
    } else {
      sess.views = 1;
      console.log("sess.views is reset");
      res.end('welcome to the session demo. refresh!');
    }
  })
  .use(csrf());

app.listen(3000);
