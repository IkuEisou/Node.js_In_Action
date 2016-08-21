var User = require('../lib/user');

exports.form = function(req, res){
  console.log('login.form');
  res.render('login', { title: 'Login' });
};

exports.submit = function(req, res, next){
  var data = req.body.user;
  console.log("login req.body is " + JSON.stringify(req.body));

  User.authenticate(data.name, data.pass, function(err, user){
    if (err) return next(err);
    if (user) {
      req.session.uid = user.id;
      console.log('req.session.uid is ' +  req.session.uid);
      res.redirect('/');
    } else {
      res.error("Sorry! invalid credentials.");
      res.redirect('back');
    }
  });
};

exports.logout = function(req, res){
  console.log('logout req.session.uid is', + req.session.uid);
  req.session.destroy(function(err) {
    if (err) throw err;
    res.redirect('/');
  });
};
