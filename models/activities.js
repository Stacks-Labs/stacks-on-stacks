/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

module.exports for activities.js
  addInterests: takes an interest and a user-trip# and
  inserts that into the database. 

  removeInterests: takes an ID# FOR THIS TABLE and removes
  it from the database. 

  getInterestID: Takes an interest and userTripID and
  returns the specific record(s) where that id can be found. 

-------------------------------------*/

module.exports = function(knex) {
  return {
    addInterests: function(interest, userTripId) {
      return knex('activities')
        .insert({
          'users_trips_id': userTripId,
          'activity': interest
        });
    },
    removeInterests: function(id) {
      return knex('activities')
        .where({
          'id': id
        })
        .del();
    },
    getInterestId: function(interest, userTripId) {
      return knex('activities')
        .where({
          'activity': interest,
          'users_trips_id': userTripId
        })
        .select('id');
    }
  };
};