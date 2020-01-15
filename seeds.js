var mongoose = require('mongoose');
var Car = require('./models/car');
var Comment = require('./models/comment');

var data =[
  {
    "name" : "Micra", 
    "image" : "https://upload.wikimedia.org/wikipedia/commons/e/e0/2017_Nissan_Micra_N-Connecta_IG-T_900cc_Front.jpg",
    "description" : "The Nissan Micra replaced the Japanese-market Nissan Cherry. It was exclusive to Nissan Japanese dealership network Nissan Cherry Store until 1999, when the \"Cherry\" network was combined into Nissan Red Stage until 2003. Until Nissan began selling badge engineered superminis from other Japanese manufacturers the March was Nissan's smallest vehicle, and was not renamed and sold at other Japanese Nissan dealership networks."
  },
  {
    "name" : "Brio", 
    "image" : "https://upload.wikimedia.org/wikipedia/commons/e/e9/2018_Honda_Brio_Satya_1.2_E_hatchback_%28DD1%3B_01-31-2019%29%2C_South_Tangerang.jpg",
    "description" : "The name Brio means vivacity or verve in Italian.[1] In Indonesia, Brio has an additional Indonesia-inspired name for the country's LCGC (Low Cost Green Car) program. The name Satya (Sanskrit: true, genuine, sincere or faithful) is used, with added local distributor's name combined as \"Honda Prospect Motor Brio Satya\" as its official LCGC name."
  },
  {
    "name" : "Fortuner", 
    "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/800px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg",
    "description" : "The Toyota Fortuner (Japanese: トヨタ・フォーチュナー Toyota Fōchunā), also known as the Toyota SW4, is a mid-size SUV manufactured by Toyota. Originally assembled only in Thailand and later also in Indonesia and other countries, the Fortuner is built on the Hilux pickup truck platform. It features three rows of seats and is available in rear-wheel drive or four-wheel drive configuration. The Fortuner is part of Toyota's IMV project in Thailand, which also includes the Hilux and the Kijang Innova (in Indonesia). Developed in large part by Toyota’s Thai operations, the Fortuner has piggybacked the success of the Hilux and is now built in a number of countries including Egypt, India, Indonesia, Argentina and Pakistan."
  }
];

function seed(){
  Car.remove({}, function(err){
    if(err){
      console.log(err);
    } else {
      console.log("remove cars!");
      data.forEach(function(carObject) {
        Car.create(carObject, function(err, newCar){
          if(err){
            console.log(err);
          } else {
            console.log("added car");
            Comment.create({
              text: "This is a comment",
              author: "James"
            }, function(err, comment){
              if(err){
                console.log(err);
              } else {
                newCar.comments.push(comment);
                newCar.save();
                console.log("added a comment");
              }
            })
          }
        })
      })
    }
  })
}

module.exports = seed;