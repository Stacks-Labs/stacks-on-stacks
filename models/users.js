module.exports = {
  signup: function(username, email, hashedPass, facebookID, facebookToken) {
    knex('users').where({loginMethod: username}).select('username')
      .then(function(userInTable) {
        if (userInTable) {
          return false;
        } else {
          if (facebookID) {
            knex('users').insert({
              'username': username,
              'email': email,
              'password': hashedPass,
              'fb_id': facebookID,
              'fb_token': facebookToken
            });
            return true;
          } else {
            knex('users').insert({
              'username': username,
              'email': email,
              'password': hashedPass,
              'fb_id': null,
              'fb_token': null
            });
            return true;
          }
        }
      });
  },

  login: function(loginString, hashedPass, facebookID, facebookToken) {

    if (facebookID) {
      knex('users').where({'username': loginString}).orWhere({'email': loginString}).select('username', 'fb_id', 'fb_token')
        .then(function(loginInfo) {
          if (facebookToken === loginInfo[0].fb_token) {
            return true;
          } else {
            return false;
          }
        });
    } else {
      knex('users').where({'username': loginString}).orWhere({'email': loginString}).select('username', 'password')
        .then(function(loginInfo) {
          if (loginInfo[0].password === encrypt(hashedPass)) { // TODO: we need to write an encrypt function in our helpers!
            return true;
          } else {
            return false;
          }
        });
    }
  }
};