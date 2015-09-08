
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
  addProfile: Takes the user ID and a text string, and adds that text string to the
    profile in the database
  getUserByName: Looks up a username and returns that username's user ID in the table. 


-------------------------------------*/

module.exports = function(knex) {

  return {
    signupLocal: function(username, hashedPass) {
      return knex('users').insert({
        'username': username,
        'password': hashedPass,
      });
    },

    signupFacebook: function(username, facebookId, facebookToken) {
      return knex('users').insert({
        'username': username,
        'fb_id': facebookId,
        'fb_token': facebookToken
      });
    },

    updateFacebook: function(facebookId, facebookToken, userId) {
      return knex('users').where('id', '=', userId)
        .update({
          'fb_id': facebookId,
          'fb_token': facebookToken
        });
    },

    login: function(loginString, hashedPass, facebookID, facebookToken) {

      if (facebookID) {
        knex('users')
          .where({'username': loginString})
          .orWhere({'email': loginString})
          .select('username', 'fb_id', 'fb_token')
          .then(function(loginInfo) {
            if (facebookToken === loginInfo[0].fb_token) {
              return true;
            } else {
              return false;
            }
          });
      } else {
        knex('users')
          .where({'username': loginString})
          .orWhere({'email': loginString})
          .select('username', 'password')
          .then(function(loginInfo) {
            if (loginInfo[0].password === encrypt(hashedPass)) { // TODO: we need to write an encrypt function in our helpers!
              return true;
            } else {
              return false;
            }
          });
      }
    },
    addProfile: function(id, profileText){
      return knex('users')
        .where({'id': id})
        .update({'profile':profileText});
    },
    getUserByName: function(username){
      return knex('users')
        .where({'username':username})
        .select();
    },
    getUserById: function(id){
      return knex('users')
        .where({'id':id})
        .select();
    },
    getUserByFB: function(facebookId){
      return knex('users')
        .where({'fb_id':facebookId})
        .select();
    }
    
  }

};
