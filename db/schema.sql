DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL NOT NULL,
  username VARCHAR(40) NOT NULL,
  password VARCHAR(255) DEFAULT 'sogimasogimasogima',
  fb_id VARCHAR(255),
  fb_token VARCHAR(255),
  CONSTRAINT pk_users PRIMARY KEY(id)
);

DROP TABLE IF EXISTS trips;

CREATE TABLE trips (
  id SERIAL NOT NULL,
  dest_name VARCHAR(255) NOT NULL,
  geocode_latitude DOUBLE PRECISION,
  geocode_longitude DOUBLE PRECISION,
  time_start TIMESTAMP NOT NULL,
  time_end TIMESTAMP NOT NULL,
  CONSTRAINT pk_trips PRIMARY KEY(id)
);

DROP TABLE IF EXISTS user_trips;

CREATE TABLE users_trips (
  id SERIAL NOT NULL,
  user_id INTEGER REFERENCES users,
  trip_id INTEGER REFERENCES trips,
  CONSTRAINT pk_users_trips PRIMARY KEY(id)
);

DROP TABLE IF EXISTS activities;

CREATE TABLE activities (
  id SERIAL NOT NULL,
  users_trips_id INTEGER NOT NULL REFERENCES users_trips,
  activity VARCHAR(255) NOT NULL,
  CONSTRAINT pk_activities PRIMARY KEY(id)
);

DROP TABLE IF EXISTS friends;

CREATE TABLE friends (
  id SERIAL NOT NULL,
  friender_id INTEGER NOT NULL REFERENCES users,
  friendee_id INTEGER NOT NULL REFERENCES users,
  CONSTRAINT pk_friends PRIMARY KEY(id)
);

DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
  id SERIAL NOT NULL,
  sender_id INTEGER NOT NULL REFERENCES users,
  receiver_id INTEGER NOT NULL REFERENCES users,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  CONSTRAINT pk_messages PRIMARY KEY(id)
);

DROP TABLE IF EXISTS amigo_feedback;

CREATE TABLE amigo_feedback (
  id SERIAL NOT NULL,
  author_id INTEGER NOT NULL REFERENCES users,
  subject_id INTEGER NOT NULL REFERENCES users,
  feedback TEXT NOT NULL,
  CONSTRAINT pk_amigo_feedback PRIMARY KEY(id)
);

DROP TABLE IF EXISTS blogs;

CREATE TABLE blogs (
  id SERIAL NOT NULL,
  author_id INTEGER NOT NULL REFERENCES users,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp,
  CONSTRAINT pk_blogs PRIMARY KEY(id)
);

DROP TABLE IF EXISTS media;

CREATE TABLE media (
  id SERIAL NOT NULL,
  blog_id INTEGER REFERENCES blogs,
  trip_id INTEGER REFERENCES trips,
  user_id INTEGER REFERENCES users,
  url TEXT NOT NULL,
  CONSTRAINT pk_media PRIMARY KEY(id)
);