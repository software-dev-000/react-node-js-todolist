var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(cookieParser())
.use(session({secret: 'todotopsecret'}))
.use(bodyParser())

.use(express.static(__dirname + '/public'));

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

var texts = ["Un texte", "Un autre", "Encore un", "Un dernier"];

app.get('/getTodolist.json', function(req, res) {
    Todo.find(function(err, todolist) {
        if(err) {
            console.log('Error');
            console.log(err);
        } else {
            res.json(todolist);
        }
    });
});

/*.post('/add.json', function(req, res) {
    var newtodo = new Todo({ desc: req.body.newtodo });

    if(newtodo.desc != '') {
        newtodo.save(function(err, todo) {
            if(err) {
                console.log('Error');
                console.log(err);
            } else {
                res.end();
            }
        });
    }
})

.get('/delete.json', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if(err) {
            console.log('Error');
            console.log(err);
        } else {
            todo.remove(function(err, todo) {
                if(err) {
                    console.log('Error');
                    console.log(err);
                } else {
                  res.redirect('/todo');
                }
            });
        }
    });
});*/

app.listen(8080);
console.log('Listening on port 8080...');
