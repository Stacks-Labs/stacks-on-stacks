/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

module.exports for amigo_feedback.js
  addFeedback: Given an author and subject ID number, stores
  feedback (text) in the database. 

  delFeecback: Taking a feedback# FOR THIS TABLE, deletes
  the record from the database. 

  listMySentFeedback: Given a user ID, returns all feedback
  where the user ID is the author.

  listAboutMeFeedback: Given a user ID, returns all feedback
  where the user is the subject.  

-------------------------------------*/

module.exports = function(knex) {
  return {
    addFeedback: function(authorId, subjectId, feedback) { // int, int, string, string
      knex('amigo_feedback')
        .insert({
          'user_id_author': authorId,
          'user_id_subject': subjectId,
          'feedback': feedback
        });
      return true;
    },
    delFeedback: function(feedbackId) { // int, int, string, string
      knex('amigo_feedback')
        .where({
          'id': feedbackId
        })
        .del();
      return true;
    },
    listMySentFeedback: function(userId) {
      return knex('amigo_feedback')
        .where({
          'user_id_author': userId
        })
        .select();
    },
    listAboutMeFeedback: function(userId) {
      return knex('amigo_feedback')
        .where({
          'user_id_subject': userId
        })
        .select();
    }
  };
};