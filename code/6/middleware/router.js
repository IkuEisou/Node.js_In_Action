var parse = require('url').parse;

module.exports = function route(obj) {
  return function(req, res, next){
    if (!obj[req.method]) {
      next();
      return;
    }
    var routes = obj[req.method];
    var url = parse(req.url);
    var paths = Object.keys(routes);

    console.log("paths is " + paths);
    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      var fn = routes[path];
      path = path
        .replace(/\//g, '\\/')                //把路径中的'/'，替换成转移字符'\/'
        .replace(/:(\w+)/g, '([^\\/]+)');     //把路径中的':id'，替换成转移字符'([^\/]+)'
      console.log("path is " + path);
      var re = new RegExp('^' + path + '$');
      console.log("re is " + re);
      var captures = url.pathname.match(re); //返回符合正则表达式的路径，如果有满足子表达式（正则表达式中圆括号中的部分）的也加入到结果数组中
      console.log("captures is " + captures);
      if (captures) {
        var args = [req, res].concat(captures.slice(1));
         console.log("args is " + args);
        fn.apply(null, args);
        return;
      }
    }
    next();
  }
};
