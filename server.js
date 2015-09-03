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

//require('./config/passport')(passport /*, connection? */)

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

require('./app/routes.js') // load our routes and pass in our app and fully configured passport

app.get('/', function(req, res){
	res.render('index.ejs')
});

app.get('/login', function(req, res){
	res.render('login.ejs')
});

app.get('/signup', function(req, res){
	res.render('signup.ejs')
});

app.listen(port);
console.log('Server running on port:', port)