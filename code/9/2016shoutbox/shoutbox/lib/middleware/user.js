var User = require('../user');

module.exports = function(req, res, next){
  if (req.remoteUser) {
    res.locals.user = req.remoteUser;
  }
  var uid = req.session.uid;
  console.log("lib user req.body is " + JSON.stringify(req.body));
  console.log("lib uid is " + uid);
  if (!uid) return next();
  User.get(uid, function(err, user){
    if (err) return next(err);
    req.user = res.locals.user = user;
    next();
  });
};
