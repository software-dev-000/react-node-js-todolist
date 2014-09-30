var mongoose = require('./db.js').mongoose;

var todoSchema = mongoose.Schema({
    desc: String
});

var Todo = mongoose.model('Todo', todoSchema);

exports.Todo = Todo;
