var app = require('./todo_app.js').app;

var Todo = require('./todoitems.js').Todo;

app.get('/todo', function(req, res) {
    Todo.find(function(err, todolist) {
        if(err) {
            console.log('Error');
            console.log(err);
        } else {
            res.render('todo.jade', {todolist: todolist});
        }
    });
})

.post('/todo/ajouter/', function(req, res) {
    var newtodo = new Todo({ desc: req.body.newtodo });

    if(newtodo.desc != '') {
        newtodo.save(function(err, todo) {
            if(err) {
                console.log('Error');
                console.log(err);
            } else {
                res.redirect('/todo');
            }
        });
    }
})

.get('/todo/supprimer/:id', function(req, res) {
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
});

app.listen(8080);
console.log('Listening on port 8080...');