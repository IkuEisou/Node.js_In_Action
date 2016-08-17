var connect = require('connect');
var morgan = require('morgan');

var app = connect()
          .use(morgan('combined', {
  			skip: function (req, res) { return res.statusCode < 400 }
			}))
          .listen(3000);
