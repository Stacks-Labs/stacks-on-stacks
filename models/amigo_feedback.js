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
  addFeedback: function(authorId, subjectId, feedback) { // int, int, string, string
    knex('amigo_feedback').insert({
      'user_id_author': authorId,
      'user_id_subject': subjectId,
      'feedback': feedback
    });
    return true;
  },
  delFeedback: function(feedbackId) { // int, int, string, string
    knex('amigo_feedback').where({
      'id': feedbackId
    }).del();
    return true;
  },
  listMySentFeedback: function(userId) {
    return knex('amigo_feedback').where({
      'user_id_author': userId
    }).select();
  },
  listAboutMeFeedback: function(user) {
    return knex('amigo_feedback').where({
      'user_id_subject': userId
    }).select();
  }
};