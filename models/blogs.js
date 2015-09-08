/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

module.exports for blogs.js
  addBlog: Takes an authorid#, a subject and a body, and adds it to the db. 

  removeBlog: Takes a blog id FOR THIS TABLE and removes it from the db.

  modifyBlog: Updates a blogpost, given the id# FOR THIS TABLE for the blog

  getBlogsByUser: returns all records for a particular user #. 

-------------------------------------*/

module.exports = {
  // takes a comma delimited string, splits it into an array
  addBlog: function(author, subject, body){
    var created = new Date();
    knex('blogs').insert({
      'author_id': author,
      'subject': subject,
      'body': body,
      'created_at' created
    })
  },
  removeBlog: function(blogId){
    knex('blogs')
      .where({id: blog_id})
      .del();
  },
  modifyBlog: function(blogId, subject, body){
    knex('blogs')
      .where({id: blog_id})
      .update({'subject': subject, 'body': body})
  },
  getBlogsByUser: function(userId){
    return knex('blogs')
      .where({user_id: userId})
      .select();
  }
};