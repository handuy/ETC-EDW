var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var multer  = require('multer');
var upload = multer();

// Home Page
router.get("/", function(req,res){
    res.render("landing");
});

// show register form
router.get("/register", function(req,res){
    res.render("register");
});

// handle sign up request
router.post("/register", upload.array(), function(req,res){
    //console.log(req.body);
   User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){
      if (err) {
          req.flash("error", err.message);
          res.redirect("/register");
      } else {
          passport.authenticate("local")(req,res,function(){
             req.flash("success", "Successfully signed up");
             res.redirect("/camp"); 
          });
      }
   }); 
});

//show login form
router.get("/login", function(req,res){
   res.render("login"); 
});

// handle login request
router.post("/login", upload.array(), passport.authenticate("local", {
    successRedirect: "/camp",
    failureRedirect: "/login"
}), function(req,res){});

// handle logout request
router.get("/logout", function(req,res){
   req.logout();
   req.flash("success", "Logged you out");
   res.redirect("/camp");
});

module.exports = router;