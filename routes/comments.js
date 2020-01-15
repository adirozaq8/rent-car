var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var Car = require('../models/car');
var Comment = require('../models/comment');
var middleware = require("../middleware");

// ==================
//  COMMENTS ROUTE
// ==================

router.get('/new', middleware.isLoggedIn, function(req, res){
  Car.findById(req.params.id, function(err, foundCar){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {car: foundCar});
    }
  })
})

router.post('/', middleware.isLoggedIn, function(req, res){
  Car.findById(req.params.id, function(err, foundCar){
    if(err){
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
          req.flash("error", "Something went wrong.");
          res.redirect(`/cars/${req.params.id}`);
        } else {
          // add username and id to comment
          comment.author.username = req.user.username;
          comment.author.id = req.user._id;
          // save comment
          comment.save()
          foundCar.comments.push(comment);
          foundCar.save();
          req.flash("success", "Successfully added comment.");
          res.redirect(`/cars/${req.params.id}`);
        }
      })
    }
  })
})

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.send(err);
    } else {
      res.render('comments/edit', {car_id: req.params.id, comment: foundComment});
    }
  })
})

router.put('/:comment_id', function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.send(err);
    } else {
      res.redirect('/cars/' + req.params.id);
    }
  })
})

router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.send(err)
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/cars/" + req.params.id);
    }
  })
})

module.exports = router;