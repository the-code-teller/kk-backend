require("dotenv").config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT;
var https_port = process.env.HTTPS_PORT;
var db = process.env.MONGO_URL;

var users = require('./routes/users');

// Set the useFindAndModify option to false
mongoose.set('useFindAndModify', false);

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    // Handle connection callback
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
    }
    
    // Connection successful
    console.log('Connected to MongoDB!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/users', users);

app.get('/', function(req, res){
    console.log('app starting on port: '+port)
    res.send('express nodejs mongodb');
});

app.listen(port, function(){
    console.log('app listening on port: '+port);
});
