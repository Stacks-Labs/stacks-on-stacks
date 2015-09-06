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

module.exports = {
  befriend: function(frienderId, friendeeId) { // int, int, string, string
    knex('friends').insert({
      'friender_id': frienderId,
      'friendee_id': friendeeId
    });
    return true;
  },
  defriend: function(friendship) { // int, int, string, string
    knex('friends').where({
      'id': friendship
    }).del();
    return true;
  },
  listFriends: function(user) {
    return knex('friends').where({
      'friender_id': user
    }).select();
  },
  listWhoFriendsMe: function(user) {
    return knex('friends').where({
      'friendee_id': user
    }).select();
  }
};