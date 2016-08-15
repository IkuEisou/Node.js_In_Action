var connect = require('connect');

function hello(req, res, next) {
  if (req.url.match(/^\/hello/)) {
    res.end('Hello World\n');
  } else {
    next();
  }
}

var userDB = {
    tobi: 'tobi',
    loki: 'loki',
    jane: 'jane' 
};

function users(req, res, next) {
  var match = req.url.match(/^\/user\/(.+)/);
  console.log("match is " + match);
  if (match) {
    var user = userDB[match[1]];
    console.log("user is " + user);
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    } else {
      var err = new Error('User not found');
      err.notFound = true;
      next(err);
    }
  } else {
    next();
  }
}

function pets(req, res, next) {
  if (req.url.match(/^\/pet\/(.+)/)) {
    foo();
  } else {
    next();
  }
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.setHeader('Content-Type', 'application/json');
  if (err.notFound) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: err.message }));
  } else {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

connect()
  .use(users)
  .use(pets)
  .use(errorHandler)
  .use(hello)
  .listen(3000);
