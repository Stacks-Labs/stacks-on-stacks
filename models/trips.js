
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
  // TODO! getGeocode function which takes a destination and returns the geocode from Google Maps. 
-------------------------------------*/


module.exports = {
  addTrip: function(destination, timeStart, timeEnd) { // string, timestamp, timestamp. 
    var geocode = getGeocode(destination); 
    knex('trips').insert({
              'dest_name': destination,
              'geocode_latitude': geocode.latitude,
              'geocode_longitude': geocode.longitude,
              'time_start': timeStart,
              'time_end': timeEnd,
              });
  }
