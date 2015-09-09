/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

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

// For the google maps functions to work, BE SURE TO INCLUDE:
// <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>




module.exports = function(knex) {
  return {
    addTrip: function(destination, timeStart, timeEnd) { // string, timestamp, timestamp.
      // var geocode = getGeocode(destination);
      return knex('trips')
        .insert({
          'dest_name': destination,
          // 'geocode_latitude': geocode.latitude,
          // 'geocode_longitude': geocode.longitude,
          'time_start': timeStart,
          'time_end': timeEnd
        });
    },
    deleteTrip: function(trip) {
      knex('user_trips')
        .where({
          'trip_id': trip
        })
        .select()
        .then(function(tripCheck) {
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
    // searchByDistanceAndTime: function(latitude, longitude, distance, time) {
    //   return knex('trips')
    //     .select()
    //     .then(function(trips) {
    //       return trips.map(function(trip) {
    //         if (google.maps.geometry.spherical.computeDistanceBetween({
    //           'lat': latitude,
    //           'lng': longitude
    //         }, {
    //           'lat': trip.geocode_latitude,
    //           'lng': trip.geocode_longitude
    //         }) && time >= trip.time_start && time <= trip.time_end) {
    //           return true;
    //         } else {
    //           return false;
    //         }
    //       });
    //     });
    // },

    // searchTripsByDistance: function(latitude, longitude, distance, includePastTrips) { // int, int, int, bool
    //   var time;
    //   includePastTrips = false; // delete this if implimenting past trips checkbox
    //   return knex('trips')
    //     .select()
    //     .then(function(trips) {
    //       if (includePastTrips) {
    //         time = 0;
    //       } else {
    //         time = new Date();
    //       }
    //       return trips.map(function(trip) {
    //         if (google.maps.geometry.spherical.computeDistanceBetween({
    //           'lat': latitude,
    //           'lng': longitude
    //         }, {
    //           'lat': trip.geocode_latitude,
    //           'lng': trip.geocode_longitude
    //         }) && time >= trip.time_start) {
    //           return true;
    //         } else {
    //           return false;
    //         }
    //       });
    //     });
    // },

    searchTripsByTime: function(begin, end) { // timestamp, timestamp
      return knex('trips')
        .select()
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
};