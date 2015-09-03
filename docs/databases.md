# Amigo Database Guide v. 0.0.1
---

The Amigo Database is built using the [MySQL](http://www.mysql.org/). This system was chosen because our data is highly relational and MySQL is a wider used standard than Postgres. However, this means that we will be deploying on [Microsoft Azure](http://azure.microsoft.com/en-us/) rather than Heroku, in order to take advantage of Azure's MySQL support. 

## Database 

Database Name: amigo
User Login: amigo
Password: letstravel
Default Port: 5432
Hostname (Azure): // todo

To use this project with heroku's Postgres database solution, make sure the ['pg' npm module](https://www.npmjs.com/package/pg) is listed in dependencies in your package.json file. 

With express, you can connect to the database using pg.connect

## Schema

```
//Table where user data is stored
  users       
  -- id 
  -- username
  -- password
  -- fb_id
  -- fb_token

//Table where information on trips is stored
  trips
  -- id
  -- dest_name
  -- geocode_latitude
  -- geocode_longitude
  -- time_start
  -- time_end

//Many-To-Many connection for trips and users - also contains each user's review of trip. 
  user_trips
  -- id
  -- user_id * (users/id)
  -- trip_id * (trips/id)
  -- trip_review_subject
  -- trip_review

//A list of interests (as a text string) of activities a user would want to do on a particular trip.  For searchable queries. 
  activities
  -- id
  -- user_trips_id * (user_trips/id)
  -- interests

//Blog posts for users to put on their profile. 
  blogs
  -- id
  -- author_id * (users/id)
  -- subject
  -- content
  -- created_at

//Hosting of images for blogs, trips, or users, containing the URL of the media. //No actual media files are stored in the database. 
//Media does not need to be connected to all three (blogs, trips, and profiles), it can be connected to just one, and the other elements can be null. 
  media
  -- id
  -- blog_id (blogs/id) // blog pictures
  -- trip_id (trips/id) // trip pictures
  -- user_id (users/id) // profile pictures
  -- url

//Private person-to-person messages (like mail)
  messages
  -- id
  -- sender_id * (users/id)
  -- reciever_id * (users/id)
  -- subject
  -- body

//Ability to "friend" users. This is a one-way connection, friendships do not need to be mutual. 
  friends
  -- id
  -- friender_id * (users/id)
  -- friendee_id * (users/id)

//Ability to leave feedback on another user.  
  amigo_feedback
  -- id
  -- user_id_author * (users/id) // feedback author
  -- user_id_subject * (users/id) // subject of feedback
  -- feedback
