var express = require('express');
var router = express.Router();
var passport = require('passport');
var Car = require('../models/car');
var middleware = require("../middleware");

// INDEX - show all cars
router.get('/', (req, res) => {
  // Get all cars from DB
  Car.find({}, function(err, cars) {
    if (err) {
      console.log(err);
    } else {
      res.render('cars/index', {cars: cars, currentUser: req.user} );
    }
  })
});

// CREATE - add new car to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCar = {name: name, price: price, image:image, description: desc, author: author}
  // Add new car and save it to DB
  Car.create(newCar, function(err, newlyCreate) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/cars');
    }
  })
});

// NEW - show form to create new car
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('cars/new');
});

// SHOW - shows more info about one car
router.get('/:id', function(req, res) {
  // find the car with provided ID
  Car.findById(req.params.id).populate("comments").exec(function(err, foundCar) {
    if (err) {
      console.log(err);
    } else {
      // handling an error for wrong objectid
      if (!foundCar) {
        return res.status(400).send("Item not found.")}
      // render show template with that car
      res.render('cars/show', {car: foundCar});
    }
  });
});

// EDIT CARS ROUTE
router.get('/:id/edit', middleware.checkCarOwnership, function(req, res){
    Car.findById(req.params.id, function(err, foundCar){
      if(err){
        res.redirect("/cars");
      } else {
        if (!foundCar) {
          return res.status(400).send("Item not found.")
        }
        res.render('cars/edit', {car: foundCar});
      }
    });
});

// UPDATE CARS ROUTE
router.put('/:id', middleware.checkCarOwnership, function(req, res){
  //find and update the car
  Car.findByIdAndUpdate(req.params.id, req.body.car, function(err, updatedCar){
    if(err){
      res.redirect('/cars');
    } else {
      res.redirect('/cars/' + req.params.id);
    }
  })
  //redirect
})

// DESTROY CARS ROUTE
router.delete('/:id', middleware.checkCarOwnership, function(req, res){
  Car.findByIdAndRemove(req.params.id, function(err, carDeleted){
    if(err){
      res.redirect("/cars");
    } else {
      res.redirect("/cars");
    }
  })
});

module.exports = router;