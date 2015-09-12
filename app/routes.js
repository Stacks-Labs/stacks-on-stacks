var path = require('path');

module.exports = function(app, passport, connection) {

  var UsersTrips = require('../models/users_trips')(connection);
  var Trips = require('../models/trips')(connection);
  var Users = require('../models/users')(connection);
  var Friends = require('../models/friends')(connection);

  app.get('/', function(req, res) {
    res.render('index.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.get('/dashboard', isLoggedIn, function(req, res) {
    res.render('dashboard.ejs');
  });

  app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/#signup',
    failureFlash: true
  }));

  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/dashboard',
      failureRedirect: '/login'
    })
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // Testing Route
  app.get('/test', function(req, res) {
    res.render('dummy.ejs');
  });

  // Serve our controller files
  app.get('/controllers/trips.js', function(req, res) {
    res.sendfile('controllers/trips.js');
  });

  app.get('/controllers/profile.js', function(req, res) {
    res.sendfile('controllers/profile.js');
  });

  app.get('/controllers/friends.js', function(req, res) {
    res.sendfile('controllers/friends.js');
  });

  // Making Trips
  app.post('/api/createTrip', isLoggedIn, function(req, res) {
    Trips.addTrip(req.body.destination, req.body.start, req.body.end)
      .then(function(response) {
        res.send(response);
      });
  });

  app.post('/api/createUserTrip', isLoggedIn, function(req, res) {
    UsersTrips.makeTrip(req.body.trip_id, req.user.id)
      .then(function(response) {
        res.send(response);
      });
  });

  // Getting Trips By User

  app.post('/api/getTrips', isLoggedIn, function(req, res) {
    Trips.getTripsByUsername(req.body.username)
      .then(function(response) {
        res.send(response);
      });
  });

  // Getting Trips By Time

  app.post('/api/getTripsByTime', isLoggedIn, function(req, res) {
    Trips.getTripsByTime(req.body.start, req.body.end)
      .then(function(response) {
        res.send(response);
      });
  });



  // Adding Profile

  app.post('/api/addProfile', isLoggedIn, function(req, res) {
    Users.addProfile(req.user.id, req.body.profile)
      .then(function(response) {
        res.send(response);
      });
  });

  // Getting Profile (by username)

  app.post('/api/getProfile', isLoggedIn, function(req, res) {
    Users.getUserByName(req.body.username)
      .then(function(response) {
        console.log(response);
        res.send(response);
      });
  });

  // Befriend

  app.post('/api/befriend', isLoggedIn, function(req, res) {
    Friends.befriend(req.body.friender, req.body.friendee)
      .then(function(response) {
        console.log(response);
        res.send(response);
      });
  });



  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

  // locally --------------------------------
  app.get('/connect/local', function(req, res) {
    res.render('connect-local.ejs', {
      message: req.flash('loginMessage')
    });
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // facebook -------------------------------

  // send to facebook to do the authentication
  app.get('/connect/facebook', passport.authorize('facebook', {
    scope: ['email']
  }));

  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback',
    passport.authorize('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // facebook -------------------------------
  app.get('/unlink/facebook', function(req, res) {
    var user = req.user;
    user.fb_token = undefined;
    user.fb_id = undefined;
    var updateQuery = "UPDATE users set fb_id=?, fb_token=? where id=?";
    connection.query(updateQuery, [null, null, user.id]);
    res.redirect('/dashboard');
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  }

};