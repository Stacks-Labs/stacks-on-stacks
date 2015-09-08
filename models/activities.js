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
module.exports for activities.js

  addInterests: Takes an interest string and a userTripID and adds an interest to the table. 
  removeInterests: Takes an activities id, and removes it from this table. 
  getInterestId: Takes an interest and a user trip id and returns the ID number of this activity. 

-------------------------------------*/

// BE SURE TO INCLUDE:
// <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>

module.exports = {
  // takes a comma delimited string, splits it into an array
  addInterests: function(interest, userTripId) {
    knex('activities')
      .insert({
        'users_trips_id': userTripId,
        'activity': interest
      });
  },
  removeInterests: function(id) {
    knex('activities')
      .where({
        'id': id
      })
      .del();
  },
  getInterestId: function(interest, userTripId){
    knex('activities')
      .where({
        'activity': interest,
        'users_trips_id': userTripId
        })
      .select('id');
  }
};