import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
// import axios from 'axios';

import userRouter from './routers/user_router';
import devRouter from './routers/dev_router';

require('dotenv').config(); // load environment variables

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// database setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/lc19x';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

app.use('/users', userRouter);
app.use('/dev', devRouter);

// ping the server every 20 minutes so heroku stays awake

// //NEED TO PUT IN OUR SERVER NAME
// setInterval(() => {
//   axios.get('https://server-6amhealth.herokuapp.com/dev');
// }, 1200000); // every 5 minutes (300000)

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
