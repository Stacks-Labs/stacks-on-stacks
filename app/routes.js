var path = require('path');

module.exports = function(app, passport, connection) {
	
	app.get('/', function(req, res) {
		res.render('index.ejs', { message: req.flash('signupMessage')});
	});

    app.get('/dashboard', isLoggedIn, function(req, res) {
        res.render('dashboard.ejs');
    });

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage')})
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/#signup',
        failureFlash: true 
        }) 
    );

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage')})
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
        })
    );

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { 
            successRedirect: '/dashboard',
            failureRedirect: '/login' 
        })
    );

    app.get('/logout', function(req, res) {
        console.log('req', req.logout)
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // facebook -------------------------------

        // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.fb_token = undefined;
        user.fb_id = undefined;
        var updateQuery = "UPDATE users set fb_id=?, fb_token=? where id=?";
        connection.query(updateQuery, [null, null, user.id]);
        res.redirect('/dashboard');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        
        res.redirect('/');
    }

}