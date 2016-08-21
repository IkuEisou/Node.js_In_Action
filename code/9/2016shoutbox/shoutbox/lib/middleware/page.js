module.exports = function(fn, perpage){
  perpage = perpage || 10;
  return function(req, res, next){
    console.log('page.js req.params[page] is '
       + req.params['page']);   
    var page = Math.max(
      parseInt(req.params['page'] || '1', 10),
      1
    ) - 1;
    
    fn(function(err, total){
      if (err) return next(err);

      req.page = res.locals.page = {
        number: page,
        perpage: perpage,
        from: page * perpage,
        to: page * perpage + perpage - 1,
        total: total,
        count: Math.ceil(total / perpage)
      };
      console.log('page.js req.page is '
        + JSON.stringify(req.page));
      next();
    });
  }
};
