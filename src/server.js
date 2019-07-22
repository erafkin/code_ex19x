import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
const http = require('http');

var cookieParser = require('cookie-parser');
var session = require('express-session');
const app = express();


app.use(cookieParser());
app.use(session({secret: "123456789p0"}));

import router from './router';

require('dotenv').config(); // load environment variables


// database setup
// || 'mongodb://localhost/lc19x';
const mongoURI = "mongodb+srv://lc19x:lastchances19x@lc19x-nfyrs.mongodb.net/lc19x";
mongoose.connect(mongoURI,{ useNewUrlParser: true });

mongoose.connection.on("open", function(ref) {

    console.log("Connected to mongo");
  });
  
  mongoose.connection.on("error", function(err) {
    console.log("Could not connect to mongo! ");
    return console.log(err);
  });
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));


// this just allows us to render ejs from the ../app/views directory
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', router);


//endpoint to ping to keep it awake
app.get('/dev', (req, res) => {
    res.send('wake up heroku!');
  });

// ping the server every 20 minutes so heroku stays awake

//TODO: NEED TO PUT IN OUR SERVER NAME (and uncomment that)
setInterval(function() {
    http.get("http://last-chances-19x.herokuapp.com/dev");
  }, 1200000); // every 5 minutes (300000)

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 3000;
app.listen(port);

console.log(`listening on: ${port}`);
