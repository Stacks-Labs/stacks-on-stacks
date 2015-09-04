var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');
var flash = require('connect-flash')

var passport = require('passport');
var session = require('express-session');
var morgan = require('morgan')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'root',
          password : '',
          database: 'strength_tracker'
        });

require('./config/passport')(passport, connection)

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get info from html forms

app.set('view engine', 'ejs')

app.use(session({
	secret: 'somestring'
}))
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
//app.use(express.static('public'));

require('./app/routes.js')(app, passport, connection) // load our routes and pass in our app and fully configured passport

app.listen(port);
console.log('Server running on port:', port)