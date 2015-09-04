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
module.exports for trips.js
  addTrip: 
    Adds a trip to the database. It takes the destination name (string), start and end times (both in timestamp form).
    It also automatically calculates the geocode of the latitude and longitude (with functions to be impliemented)
    All are stored in the database. 
  deleteTrip:
    Checks to see if any other user is referencing the trip. If not, deletes the trip
  searchByDistanceAndTime: 
    Queries the database for all trips within 'distance' of an origin point and time. 
    Before this function is called, the geocode must be parsed into latitude and longitude 'double' float values. 
  searchByDistance: 
    Queries the database for all trips within 'distance' of an origin. It is hardcoded to 
    return only trips that are not yet passed -- that line must be deleted if an "include past trips" checkbox is an option
    available to the user. 
  searchByTime:
    Queries the database for all trips that intersect with a time period specified by the user; 

-------------------------------------*/

// BE SURE TO INCLUDE:
// <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>

var users = require('./users.js');
var trips = require('./trips.js');


module.exports = {
  makeTrip: function(destination, timeStart, timeEnd, user){
    trips.addTrip(destination, timeStart, timeEnd, function(user){ // can you promisify this?
        var trip = knex('trips').raw('SELECT LAST_INSERT_ID();');
        tripId = trip[0].id;
        knex('users_trips').insert({'user_id':user, 'trip_id':tripId});
      });
  },
  getTripsByUser: function(user){
    return knex('users_trips').where({'user_id':user}).select();
  },
  getUsersByTrip: function(trip){
    return knex('users_trips').where({'trip_id':trip}).select();
  }
};