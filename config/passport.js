var LocalStrategy = require('passport-local').Strategy;
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
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        process.nextTick(function() {

        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        connection.query( "SELECT * FROM users WHERE username = ?",  [username], function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that username
            if (user.length) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            }
            if (!req.user) {
                console.log('error')

            
                // if there is no user with that username create the user
                var newUser            = new Object();

                // set the user's local credentials
                newUser.username    = username;
                newUser.password = bcrypt.hashSync(password, 10);

                var insertQuery = "INSERT INTO users (username, password) values (?, ?)"
                // save the user
                connection.query(insertQuery, [username, newUser.password], function(err, user) {
                    newUser.id = user.insertId;
                    return done(null, newUser);
                });
            } else {
                var user = req.user;
                user.username    = username;
                user.password = bcrypt.hashSync(password, 10);

                var updateQuery = "UPDATE users set username=?, set password=?";
                connection.query(insertQuery, [username, password], function(err,user) {
                    return done(null, user);
                })
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
        connection.query("SELECT * from users WHERE username = ?",  [email], function(err, user) {
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
        clientID          : configAuth.facebookAuth.clientID,
        clientSecret      : configAuth.facebookAuth.clientSecret,
        callbackURL       : configAuth.facebookAuth.callbackURL,
        profileFields     : ["emails", "displayName", "name", "hometown", "location", "gender"],
        passReqToCallback : true
    },

    // facebook will send back the token and profile
    function(req, accessToken, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {

        //user is not logged in yet
        if (!req.user) {

            connection.query( "SELECT * FROM users WHERE fb_id = ?", [profile.id], function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
                // if the user is found, then log them in
                if (user.length) {
                    return done(null, user[0]); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new Object();

                    // set all of the facebook information in our user model
                    newUser.fb_id    = profile.id; // set the users facebook id                   
                    newUser.fb_token = accessToken; // we will save the token that facebook provides to the user                    
                    newUser.username  = profile.displayName; // look at the passport user profile to see how names are returned

                    // save our user to the database
                    var insertQuery = "INSERT INTO users ( fb_id, fb_token, username) values (?,?,?)";
                    connection.query(insertQuery, [profile.id, accessToken, profile.displayName], function(err,user) {
                        newUser.id = user.insertId;
                  
                        return done(null, newUser);
                    });
                }

            });
        //user is logged in and needs to be merged
        } else {

            var user = req.user;

            user.fb_id = profile.id;
            user.fb_token = accessToken;

            var updateQuery = "UPDATE users set fb_id=?, fb_token=? where id=?;";
            connection.query(updateQuery, [profile.id, accessToken, user.id], function(err,user) {
                return;
            })
        }


            // find the user in the database based on their facebook id
            connection.query( "SELECT * FROM users WHERE fb_id = ?", [profile.id], function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
                // if the user is found, then log them in
                if (user.length) {
                    return done(null, user[0]); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new Object();

                    // set all of the facebook information in our user model
                    newUser.fb_id    = profile.id; // set the users facebook id                   
                    newUser.fb_token = accessToken; // we will save the token that facebook provides to the user                    
                    newUser.username  = profile.displayName; // look at the passport user profile to see how names are returned
                    /*newUser.email = profile.emails[0].value;*/ // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    var insertQuery = "INSERT INTO users ( fb_id, fb_token, username) values (?,?,?)";
                    connection.query(insertQuery, [profile.id, accessToken, profile.displayName], function(err,user) {
                        console.log('ERR', err)
                        newUser.id = user.insertId;
                  
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

};
