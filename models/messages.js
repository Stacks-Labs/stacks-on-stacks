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
  addMessage: function(sender, reciever, subject, body) { // int, int, string, string
    knex('messages')
      .insert({
        'sender_id': sender,
        'receiver_id': receiver,
        'subject': subject,
        'body': body
      });
    return true;
  },
  deleteMessage: function(msgId) { // int, int, string, string
    knex('messages')
      .where({
        'id': msgId
      }).del();
    return true;
  },
  getMyMessages: function(userId) {
    return knex('messages')
      .where({
          'receiver_id': userId
      })
      .select()
      .then(function(messages) {
          return messages;
      });
  },
  getMySentMessages: function(userId) {
    return knex('messages')
      .where({
        'sender_id': userId
      })
      .select()
      .then(function(messages) {
        return messages;
      });
  }
};