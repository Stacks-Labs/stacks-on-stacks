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
    Checks to see if any other user is referencing the trip. 
-------------------------------------*/

// BE SURE TO INCLUDE:
// <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>




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
    return true;
  },
  deleteTrip: function(trip) {
    knex('user_trips').where({
      'trip_id': trip
    }).select().
    then(function(tripCheck) {
      if (!tripCheck.length) {
        knex('trips').where({
          'id': trip
        }).del();
        return true;
      } else {
        return false;
      }
    });
  },

  // BE SURE TO INCLUDE:
  // <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>
  searchByDistanceAndTime: function(latitude, longitude, distance, time) {
    return knex('trips').select()
      .then(function(trips) {
        return trips.map(function(trip) {
          if (google.maps.geometry.spherical.computeDistanceBetween({
            'lat': latitude,
            'lng': longitude
          }, {
            'lat': trip.geocode_latitude,
            'lng': trip.geocode_longitude
          }) && time >= trip.time_start && time <= trip.time_end) {
            return true;
          } else {
            return false;
          }
        });
      });
  },
  searchByDistance: function(latitude, longitude, distance, includePastTrips) { // int, int, int, bool
    var time;
    return knex('trips').select()
      .then(function(trips) {
        if (includePastTrips) {
          time = 0;
        } else {
          time = new Date();
        }
        return trips.map(function(trip) {
          if (google.maps.geometry.spherical.computeDistanceBetween({
            'lat': latitude,
            'lng': longitude
          }, {
            'lat': trip.geocode_latitude,
            'lng': trip.geocode_longitude
          }) && time >= trip.time_start) {
            return true;
          } else {
            return false;
          }
        });
      });
  },

  searchByTime: function(begin, end) { // timestamp, timestamp
    return knex('trips').select()
      .then(function(trips) {
        return trips.map(function(trip) {
          if ((begin >= trip.time_start && begin <= trip.time_end) ||
            (end >= trip.time_start && end <= trip.time_end)) {
            return true;
          } else {
            return false;
          }
        });
      });
  }
};