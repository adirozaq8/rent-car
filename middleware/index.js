var Car = require('../models/car');
var Comment = require('../models/comment');

// all middleware goes here

var middlewareObj = {};

middlewareObj.checkCarOwnership = function(req, res, next){
  // is user logged in?
  if(req.isAuthenticated()){
    Car.findById(req.params.id, function(err, foundCar){
      if(err){
        req.flash("error", "Car not found.");
        res.redirect("back");
      } else {
        // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
        if (!foundCar) {
          req.flash("error", "Item not found.");
          return res.redirect("back");
        }
        // does user own a campground?
        if(foundCar.author.id.equals(req.user._id)){
          next()
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back")
        }
      }
    });
  } else {
    req.flash("error", "Please login first!");
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
  // is user logged in?
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        // does user own a campground?
        if(foundComment.author.id.equals(req.user._id)){
          next()
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back")
        }
      }
    });
  } else {
    req.flash("error", "Please login first!");
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login first!");
  res.redirect('/login');
}

module.exports = middlewareObj;