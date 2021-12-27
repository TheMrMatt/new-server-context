const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/users');

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      return done(err, user);
    });
  });
  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, (username, password, done) => {
      // Match user
      User.findOne({
        email: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.use(new FacebookStrategy({
    clientID: "1272692419817046",
    clientSecret: "8601352b20bd03ab0d246c92606fd4bb",
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'picture.type(large)', 'displayName', 'email',],
    proxy: true,
  },
    function (token, refreshToken, profile, done) {
      console.log(profile)

      // asynchronous
      process.nextTick(function () {

        // find the user in the database based on their facebook id
        User.findOne({ 'email': profile._json.email }, function (err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
            return done(err);

          // if the user is found, then log them in
          if (user) {
            console.log("user found")
            console.log(user)
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();

            // set all of the facebook information in our user model

            newUser.password = profile.id;
            newUser.nombreYapellido = profile.displayName; // look at the passport user profile to see how names are returned
            newUser.email = profile._json.email; // facebook can return multiple emails so we'll take the first
            newUser.imagenPerfil = { url: profile.photos[0].value, filename: profile.displayName };
            newUser.imagenPortada = { url: profile.photos[0].value, filename: profile.displayName };
            newUser.descripcion = '';
            newUser.tipoUsuario = 'Normal';

            // save our user to the database
            newUser.save(function (err) {
              if (err) {
                console.log(err);
                throw err;
              }
              else {
                return done(null, newUser);
              }



            });
          }

        });

      })

    }));


};