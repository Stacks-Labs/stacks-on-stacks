
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

// var haversine = function(){
//   function haversine() {
//        var radians = Array.prototype.map.call(arguments, function(deg) { return deg/180.0 * Math.PI; });
//        var lat1 = radians[0], lon1 = radians[1], lat2 = radians[2], lon2 = radians[3];
//        var R = 6372.8; // km -- the radius of the earth (CONSTANT!)
//        var dLat = lat2 - lat1;
//        var dLon = lon2 - lon1;
//        var a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
//        var c = 2 * Math.asin(Math.sqrt(a));
//        return R * c;
// }
// console.log(haversine(36.12, -86.67, 33.94, -118.40));
// }



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
  deleteTrip: function(trip){
    knex('user_trips').where{'trip_id':trip}.select().
      then(function(tripCheck){
        if(!tripCheck.length){
          knex('trips').where({'id':trip}).del()
          return true;
        }
        else { return false; }
      })
    
  },
  getTrips: function(latitude, longitude, distance, time){

  }
}


