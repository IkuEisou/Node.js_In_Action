var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

var join = path.join;
var photos = [];

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', {
   title: 'Photo List' ,
   photos: photos
  });
});

router.get('/upload', function(req, res, next){
	res.render('upload',{
		title: 'Photo upload',
	});
});

router.upload = function(dir){
	return function (req, res, next) {
		var form = new formidable.IncomingForm();   //创建上传表单
	    form.encoding = 'utf-8';        //设置编辑
	    form.uploadDir = 'public/'+ dir;    //设置上传目录
	    form.keepExtensions = true;     //保留后缀
	    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

	    form.parse(req, function(err, fields, files) {
		    if (err) {
		      console.log(err);
		    }  
		    var filename = files.image.name;
		    var newPath = form.uploadDir + filename ;
		    console.log("fields body is " + JSON.stringify(fields));
		    fs.rename(files.image.path, newPath, function (err) {
		      	if (err) {return(err);}
		      });  //上传文件

		  	photos.push({
				name: fields.name,
				path: dir + filename
			});
			res.redirect('/');  		    
	 	 });
	}
};

module.exports = router;
