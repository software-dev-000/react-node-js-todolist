var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todolist');

var db = mongoose.connection;
db.on('error', function() {
    console.log('Error: connection to the database failed');
})
.on('open', function() {
    console.log('Database opened');
});

exports.mongoose = mongoose;
