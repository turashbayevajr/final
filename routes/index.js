var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Form = require('../models/form');
var Post = require('../models/post');
var path = require('path');
var app  = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const fs = require("fs");
const multer = require("multer");
app.use(bodyParser.urlencoded({ extended: true }));



router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});
router.post('/', function(req, res, next) {

	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});


router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			const cmp = bcrypt.compare(req.body.password, data.password);

			
			if(cmp){
		
				req.session.userId = data.unique_id;
				;
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	
	User.findOne({unique_id:req.session.userId},function(err,data){
		if(!data){
			res.redirect('/');
		}else{
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});
router.get('/news', function (req, res, next) {

	User.findOne({unique_id:req.session.userId},function(err,data){
		if(!data){
			res.redirect('/');
		}else{
			return res.render('news.ejs', {"name":data.username,"email":data.email});
		}
	});
});
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
	}
})
const upload = multer({ storage: storage })
router.post("/news",upload.single('image'),(req,res)=>{
	var img = fs.readFileSync(req.file.path);
	var encode_img = img.toString('base64');
	var final_img = {
		contentType:req.file.mimetype,
		image:new Buffer(encode_img,'base64')
	};
	Post.create(final_img,function(err,result){
		if(err){
			console.log(err);
		}else{
			console.log(result.img.Buffer);
			console.log("Saved To database");
			res.contentType(final_img.contentType);
			res.send(final_img.image);
		}
	})
})




router.get('/help', function (req, res, next) {

	User.findOne({unique_id:req.session.userId},function(err,data){
		if(!data){
			res.redirect('/');
		}else{
			return res.render('help.ejs', {"name":data.username,"email":data.email});
		}
	});
});


router.post("/help",  function (req, res) {
	let newForm = new Form({
		age: req.body.age,
		message: req.body.message,
		user_id: req.session.userId
	});
	newForm.save();
	res.redirect('/help')
});

router.get('/logout', function (req, res, next) {

	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});


router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});


router.post('/forgetpass', function (req, res, next) {


	User.findOne({email:req.body.email},function(err,data){

		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});



module.exports = router;