// Get packages
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var expressSession = require("express-session");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// Get the camp, comment and authentication routes
var campRoute = require("./routes/camp");
var commentRoute = require("./routes/comment");
var indexRoute = require("./routes/index");

// Import the User module for passport config
var User = require("./models/user");

// flash
app.use(flash());

// Passport config
app.use(expressSession({
    secret: "hahaha",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seed data, use ejs+css, connect mongodb
app.set("view engine", "ejs");
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://edw:edw@ds161913.mlab.com:61913/edw");
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(methodOverride("_method"));

// use the routes
app.use(campRoute);
app.use(commentRoute);
app.use(indexRoute);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server running"); 
});