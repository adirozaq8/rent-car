require('dotenv').config()
var express     = require('express'),
      app         = express(),
      bodyParser  = require('body-parser'),
      mongoose    = require('mongoose'),
      flash       = require('connect-flash'),
      passport    = require('passport'),
      LocalStrategy = require('passport-local'),
      methodOverride = require('method-override'),
      passportLocalMongoose = require('passport-local-mongoose'),
      User        = require('./models/user'),
      seedDB      = require('./seeds');

var carRoutes = require('./routes/cars'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

var url = process.env.DATABASEURL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log("connected to DB")
}).catch( err => {
  console.log('Error:', err.message)
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "This car website will be the best in the world",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// // SEEDING THE DATABASE (Optional)
// seedDB();

app.use("/", indexRoutes);
app.use("/cars", carRoutes);
app.use("/cars/:id/comments", commentRoutes);

// Server
const port = process.env.PORT || 8080;
app.listen(port, process.env.IP, function() {
  console.log("Server listening to " + port);
});