module.exports = function(app, passport, connection) {
	
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage')})
    });

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage')})
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        req.direct('/')
    })

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/profile',
                                      failureRedirect: '/' }));

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        
        res.redirect('/');
    }

}