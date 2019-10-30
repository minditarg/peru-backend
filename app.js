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
const FacebookStrategy = require('passport-facebook').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const User = require('./db/models').Usuario;
const customMdw = require('./middleware/custom');
//end login require

var app = express();
var cors = require('cors');
// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

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

//INICIO autenticacion LOCAL
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
//FIN autenticacion LOCAL
//INICIO autorizacion por facebook




passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_APP_CALLBACK,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({
    where: {
      providerId: profile.id
    }
  })
    .then(data => {
      if (data === null) {
        return done(null, profile,null);
      }
      return done(null, profile,null); 
    })
    .catch(err => console.log("Hubo un error", err)) // error en DB
}

));






// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: process.env.FACEBOOK_APP_CALLBACK,
//   profileFields: ['id', 'displayName', 'photos', 'email']
// },
// function(accessToken, refreshToken, profile, done) { console.log("entree");
//   User.findOne({where: { providerId: profile.id }}, function(err, user) {   console.log("ha2aay que crear un nuevo usuarioo");
//     if(err) throw(err);
//     if(!err && user!= null) return done(null, user);
//     console.log("haaay que crear un nuevo usuarioo");
//     var user = new Usuario({
//       provider_id: profile.id,
//       provider: profile.provider,
//       nombre: profile.displayName,
//       avatar: profile.photos[0].value
//     });
//     user.save(function(err) {
//       if(err) throw err;
//       done(null, user);
//     });
//   });
// }
// ));
//FIN autorizacion por facebook

//conectamos todos los middleware de terceros

//app.use('/public', express.static(process.cwd() + '/public'));


//el último nuestro middleware para manejar errores
app.use(customMdw.errorHandler);
app.use(customMdw.notFoundHandler);

//end configuracion del login
module.exports = app;
