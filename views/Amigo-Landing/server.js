var express = require('express');
var app = express();

//body parser stuff
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}));

var port = process.env.PORT || 4000
var host = process.env.HOST || 'http://localhost:' + port
app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.get('/Hello', function (req, res) {
  res.send('Hello world')
})

app.get('/goodbye', function (req, res) {
  res.send('goodbye world')
})

var server = app.listen(app, function () {
  console.log('Example app listening at http://localhost', host, port);
});

