var Camp = require("../models/camp");
var Comment = require("../models/comment");
var middleObj = {};

middleObj.checkCampOwnership = function(req,res,next){
    if (req.isAuthenticated()){
        Camp.findById(req.params.id, function(err, foundCamp){
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permisson to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first");
        res.redirect("/login");
    }    
};

middleObj.checkCommentOwnership = function(req,res,next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
            if (err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permisson to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first");
        res.redirect("back");
    }    
};

middleObj.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");    
};

module.exports = middleObj;