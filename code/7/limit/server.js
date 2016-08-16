var connect = require('connect');
var bodyParser = require('body-parser');

var app = connect()
          .use(bodyParser.json())
          .use(function (req, res) {
          	res.write("You post:");
          	res.end(JSON.stringify(req.body));
          });

app.listen(3000);
