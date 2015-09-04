var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt')
var configAuth = require('./auth');
// var User = require('../app/models/user');

module.exports = function(passport, connection) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ?", [id], function(err, user) {
            done(err, user[0]);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query( "SELECT * FROM users WHERE email = ?",  [email], function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email create the user
                var newUser            = new Object();

                // set the user's local credentials
                newUser.email    = email;
                newUser.password = bcrypt.hashsync(password, 10);

                var insertQuery = "INSERT INTO users (email, password) values (?, ?)"
                // save the user
                connection.query(insertQuery, [email, newUser.password], function(err, user) {
                    newUser.id = user.insertId;
                    return done(null, newUser);
                });
            }
        });    
        });
    }));

	    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query("SELECT * from users WHERE email = ?",  [email], function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);
            // if no user is found, return the message
            if (!user.length)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, user[0].password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user[0]);
        });
    }));

	passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ["emails", "displayName", "name", "hometown", "location", "gender"]
    },

    // facebook will send back the token and profile
    function(accessToken, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            connection.query( "SELECT * FROM users WHERE facebook_email = ?", [profile.emails[0].value], function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
                // if the user is found, then log them in
                if (user) {
                    return done(null, user[0]); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new Object();

                    // set all of the facebook information in our user model
                    newUser.facebook_id    = profile.id; // set the users facebook id                   
                    newUser.facebook_token = accessToken; // we will save the token that facebook provides to the user                    
                    newUser.facebook_name  = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.facebook_email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    var insertQuery = "INSERT INTO users ( facebook_id, facebook_token, facebook_name, facebook_email ) values (?,?,?,?)";
                    connection.query(insertQuery [profile.id, accessToken, profile.displayName, profile.emails[0].value], function(err, user){
                        newUser.id = user.insertId

                        return done(null, newUser)
                    });
                }

            });
        });

    }));

};
