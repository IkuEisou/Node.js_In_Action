var connect = require('connect');
var basicAuth = require('basic-auth-connect');

var app = connect();
var User = {
  authenticate: function(credentials, callback) {
    if (credentials.user == 'tobi'
      && credentials.pass == 'ferret') {
      callback(null, credentials);
    } else {
      callback(new Error('Incorrect credentials.'));
    }
  }
}

app.use(basicAuth(function(user, pass, callback){
  User.authenticate({ user: user, pass: pass }, gotUser);

  function gotUser(err, user) {
    if (err) return callback(err);
    callback(null, user);
  }
}))
.use(function (req,res,next) {
  res.end("Welcome tobi");
});

app.listen(3000);
