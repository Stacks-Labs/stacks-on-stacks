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
    addMessage: function(sender, receiver, subject, body) { // int, int, string, string
      return knex('messages')
        .insert({
          'sender_id': sender,
          'receiver_id': receiver,
          'subject': subject,
          'body': body
        });
    },
    deleteMessage: function(msgId) { // int, int, string, string
      return knex('messages')
        .where({
          'id': msgId
        }).del();
    },
    // getMessages: function(username, isReceiver) { // int, bool
    //    var grabId = '';
    //     if(isReceiver === 'receiver'){
    //       grabId = 'reciever_id';

    //     } else {
    //       grabId = 'sender_id';
    //     }
    //    return knex('users')
    //     .innerJoin('messages', 'users.id', 'messages.receiver_id')
    //     .innerJoin('messages', 'users.id', 'messages.sender_id')
    //     .where(grabId, username)
    //     .select('sender_id', 'reciever_id', 'subject', 'body');
    // },
  };
}