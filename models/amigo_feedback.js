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
module.exports for amigo_feedback.js

  addInterests: Takes an author, a subject(person) and text feedback and adds it to the table
  delFeedback: Removes feedback based on that feedback's ID
  listMySentFeedback: Takes a userID and returns all feedback where user is the author
  listAboutMeFeedback: Takes a userID and returns all feedback where user is the subject.

-------------------------------------*/

module.exports = {
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