var localStrategy = require

var configAuth = require('/.auth');



passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  },

  function(accessToken, refreshToken, profile, done) {
  	process.nextTick(function(){
  		connection.query
  	})
    });
  }
))