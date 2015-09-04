
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

// /*------------------------------------
// module.exports for trips.js
//   addTrip: 
//     Adds a trip to the database. It takes the destination name (string), start and end times (both in timestamp form).
//     It also automatically calculates the geocode of the latitude and longitude (with functions to be impliemented)
//     All are stored in the database. 
// -------------------------------------*/


// module.exports = {
//   signup: function(username, hashedPass, facebookID, facebookToken) {
//     knex('users').where({'username': username}).select('username')
//       .then(function(userInTable) {
//         if (userInTable) {
//           return false;
//         } else {
//           if (facebookID) {
//             knex('users').insert({
//               'username': username,
//               'password': hashedPass,
//               'fb_id': facebookID,
//               'fb_token': facebookToken
//             });
//             return true;
//           } else {
//             knex('users').insert({
//               'username': username,
//               'password': hashedPass,
//               'fb_id': null,
//               'fb_token': null
//             });
//             return true;
//           }
//         }
//       });
//   },

//   login: function(username, hashedPass, facebookID, facebookToken) {
//     if (facebookID) {
//       knex('users').where({'username': username}).select('username', 'fb_id', 'fb_token')
//         .then(function(loginInfo) {
//           if (facebookToken === loginInfo[0].fb_token) {
//             return true;
//           } else {
//             return false;
//           }
//         });
//     } else {
//       knex('users').where({'username': username}).select('username', 'password')
//         .then(function(loginInfo) {
//           if (loginInfo[0].password === encrypt(hashedPass)) { // TODO: we need to write an encrypt function in our helpers!
//             return true;
//           } else {
//             return false;
//           }
//         });
//     }
//   }
// }; // end module.exports object