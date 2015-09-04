
// THIS MUST BE ON THE SERVER FILE FOR THIS TO WORK.
// var databasehost = process.env.HOST || 'localhost';
// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: databasehost,
//     user: 'amigo',
//     password: 'letstravel',
//     database: 'amigo',
//     charset: 'utf8'
//   }
// });

/*------------------------------------
module.exports for users.js
  signup: 
    Checks to see if user exists. If so, returns false; if not,
    takes username, hashedPass, facebookID, facebookToken and inserts them in the database. 
    If FacebookID is null, works with just username and hashpass. 
  login: 
    Grabs the username and hashed password from the database, checks the password provided
    against the hashed password in the database
    TODO REQUIRED: Must use hashing function (not yet written) -- BB

-------------------------------------*/

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
}; // end module.exports object