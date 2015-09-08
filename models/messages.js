/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

module.exports for messages.js
  addMessage: Takes a senderID, a reciver ID, a subject and a body, and inserts it into the database.

  deleteMessage: Deletes a message (by message ID#)

  getMyMessages: Fed a user-id, gets all message records where the user-id is the recipient. 

  getMySentMessages: Fed a user-id, gets all message records where the user-id is the sender.

-------------------------------------*/

module.exports = function(knex) {
  return {
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
}