var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todolist');

var db = mongoose.connection;
db.on('error', function() {
    console.log('Error: connection to the database failed');
})
.on('open', function() {
    console.log('Database opened');
});

var todoSchema = mongoose.Schema({
    desc: String
});

var Todo = mongoose.model('Todo', todoSchema);

var app = express();

app.use(cookieParser())
.use(session({secret: 'todotopsecret'}))
.use(bodyParser())

.use(express.static(__dirname + '/public'));

//var text = ["Texte 1", "Un autre texte", "Et encore un", "Le dernier !"];

app.get('/', function(req, res) {
    Todo.find(function(err, todolist) {
        if(err) {
            console.log('Error');
            console.log(err);
        } else {
            res.render('index.ejs', {todolist: todolist});
        }
    });
});

app.post('/', function(req, res) {
    var newtodo = new Todo({desc: req.body.newtodo});
    if(newtodo.desc != '') {
        newtodo.save(function(err, todo) {
            if(err) {
                console.log('Error');
                console.log(err);
            }
        });
    }
});

app.listen(8080);
console.log('Listening on port 8080...');