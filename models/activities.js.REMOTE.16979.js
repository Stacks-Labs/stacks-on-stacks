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

var _ = require('underscore');

module.exports = {
  // takes a comma delimited string, splits it into an array
  parseInterests: function(interestStr) {
    return interestStr.split(',');
  },
  updateInterests: function(interestsArr, userTripId) {
    knex('activities').where({
        user_trips_id: userTripId
      }).select()
      .then(function(userTrip) {
        var interests = _.uniq(interestsArr.concat(JSON.parse(userTrip[0]
          .activity)));
        acts = JSON.stringify(interests);
        knex('activities').update({
          'activity': acts
        });
      });
  },
  addInterests: function(interestStr, userTripId) {
    var dbInterests = JSON.stringify(module.exports.parseInterests(
      interestStr));
    knex('activities').insert({
      'users_trips_id': userTripId,
      'activity': dbInterests
    });
  },
  removeInterests: function(interestStr, userTripId) {
    var dbInterests = JSON.stringify(module.exports.parseInterests(
      interestStr));
    removeArr = module.exports.parseInterests(interestStr);
    knex('activities').where({
        'user_trips_id': userTripId
      }).select()
      .then(function(userTrip) {
        newInterestList = dbInterests.reject(function(element) {
          return (removeArr.indexOf(element) > -1);
        });
        acts = JSON.stringify(newInterestList);
        knex('activities').update({
          'activity': acts
        });
      });
  }

};