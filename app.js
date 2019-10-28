var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Sequelize = require('sequelize');

//login require
require('dotenv').config()
const bodyParser = require('body-parser');
const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
//const user_routes         = require('./routes/user');
const User = require('./db/models').Usuario;
const customMdw = require('./middleware/custom');
//end login require

var app = express();
var cors = require('cors');
// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(cors());

require('./routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message })
});


//configuracion del login
/** config de estrategia local de passport ******/
passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  session: false
}, (username, password, done) => {
  User.findOne({
    where: {
      email: username
    }
  })
    .then(data => {
      if (data === null) {
        return done(null, false);
      }//el usuario no existe
      else if (!bcrypt.compareSync(password, data.password)) { return done(null, false); } //no coincide la password
      return done(null, data); //login ok
    })
    .catch(err => done(err, null)) // error en DB
}));

/** config de estrategia jwt de passport ******/
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.algorithms = [process.env.JWT_ALGORITHM];

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.findById(jwt_payload.sub)
    .then(data => {
      if (data === null) { 
        return done(null, false);
      }
      else
        return done(null, data);
    })
    .catch(err => done(err, null))
}));

//conectamos todos los middleware de terceros
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
//app.use('/public', express.static(process.cwd() + '/public'));


//el último nuestro middleware para manejar errores
app.use(customMdw.errorHandler);
app.use(customMdw.notFoundHandler);

//end configuracion del login
module.exports = app;
