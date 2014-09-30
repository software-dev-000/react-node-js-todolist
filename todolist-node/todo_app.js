var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(cookieParser())
.use(session({secret: 'todotopsecret'}))
.use(bodyParser())

.use(express.static(__dirname + '/public'));

exports.app = app;
