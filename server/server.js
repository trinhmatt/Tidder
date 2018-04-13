const express = require('express'),
      router = require('./routes/routes.js'),
      path = require('path'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      User = require('../models/user'),
      LocalStrategy = require('passport-local'),
      credentials = require('./mlab.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));

//DATABASE CONFIG

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
mongoose.connect(`mongodb://${credentials.default.user}:${credentials.default.pass}@ds241039.mlab.com:41039/tidder`);

//PASSPORT CONFIG

app.use(require('express-session')({
  secret: 'This is the secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//To pass the current user info into every route
app.use( (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', router);

module.exports=app;
