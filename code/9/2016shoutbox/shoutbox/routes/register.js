var User = require('../lib/user');

exports.form = function (req,res) {
	res.render('register', {title:'注册'});
};

exports.submit = function(req, res, next){
  var data = req.body.user;
  console.log("register is " + JSON.stringify(req.body));
  User.getByName(data.name, function(err, user){
    if (err) return next(err);

    if (user.id) {
      res.error("Username already taken!");
      console.log("Username already taken!");
      res.redirect('back');
    } else {
      user = new User({
        name: data.name,
        pass: data.pass
      });

      user.save(function(err){
        if (err) return next(err);
        req.session.uid = user.id;
        res.redirect('/');
      });
    }
  });
};
