import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { isBuffer } from 'util';

import router from './router';

require('dotenv').config(); // load environment variables

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// database setup

const mongoURI = process.env.MONGODB_URI  || 'mongodb://localhost/lc19x';

mongoose.connect(mongoURI,{ useNewUrlParser: true });

mongoose.connection.on("open", function(ref) {
    console.log("Connected to mongo server.");
  });
  
  mongoose.connection.on("error", function(err) {
    console.log("Could not connect to mongo server!");
    return console.log(err);
  });
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// enable only if you want static assets from folder static
// app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use('/user', router);
// app.use('/dev', devRouter);

//default endpoint
app.get('/', (req, res) => {
  res.send('welcome to the last chances 19x database');
});



// ping the server every 20 minutes so heroku stays awake

// //NEED TO PUT IN OUR SERVER NAME
// setInterval(() => {
//   axios.get('https://server-6amhealth.herokuapp.com/dev');
// }, 1200000); // every 5 minutes (300000)

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 8000;
app.listen(port);

console.log(`listening on: ${port}`);
