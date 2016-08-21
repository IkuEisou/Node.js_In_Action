var Entry = require('../lib/entry');

exports.list = function(req, res, next){
  var page = req.page;
  console.log('entries.js  req.page is', + JSON.stringify(req.page));
  // Entry.getRange(page.from, page.to, function(err, entries) {
  Entry.getRange(0, -1, function(err, entries) {
    if (err) return next(err);

    res.render('entries', {
      title: 'Entries',
      entries: entries,
    });
  });
};

exports.form = function(req, res){
  res.render('post', { title: 'Post' });
};

exports.submit = function(req, res, next){
  var data = req.body.entry;

  var entry = new Entry({
    "username": res.locals.user.name,
    "title": data.title,
    "body": data.body
  });

  entry.save(function(err) {
    if (err) return next(err);
    if (req.remoteUser) {
      res.json({message: 'Entry added.'});
    } else {
      res.redirect('/');
    }
  });
};
