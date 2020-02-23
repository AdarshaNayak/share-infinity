// nodejs server running on aws
var express =  require('express');
var app =  express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');
var wallet = require('./models/wallet');
var rating = require('./models/rating');
var completedTask = require('./models/completedTask');
var task = require('./models/task');
var systemInfo = require('./models/systemInfo');
var PlatformProfit =  require('./models/platformProfit');

var ip = 'localhost';

var db =  `mongodb://${ip}/shareInfinity`;

mongoose.connect(db,{ useNewUrlParser: true , useUnifiedTopology: true})
    .then(() => {
        console.log("Database connection successfull");
    })
    .catch(() => {
        console.log("Database connection error");
    });

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));
var port = 8080;

app.listen(port,function () {
    console.log("app listening on port "+port);
})




