import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as admin from 'firebase-admin';
import axios from 'axios';

import userRouter from './routers/user_router';
import devRouter from './routers/dev_router';

require('dotenv').config(); // load environment variables


//ARE WE USING FIREBASE?
// initialize firebase admin
const serviceAccount = {
  type: 'service_account',
  project_id: 'p-tue-61704',
  private_key_id: 'cd2378c23d01925fe57490d116b02e1dd694838a',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD4AXWXWvgm4d4a\nZpoPtiCYsfKWVYO9K6BzCfftoUFTcesN58DFt5hQbmHdbRCOmWIr2C/5b3uTdKrS\nGiLmMj4PYacI13fI0nHFBPHySt5+TSIg0ew9gdCeRCdvX4N9Q7Ee85DnJAIOkzYJ\ntbn3Nfxy61zNtOWloP5rYtGRscMbslJLX22JrN+VlrG5q4dS3sgvOQsZKmYlDD6g\n278RBMNdeoERJpQWty64PBXrBdQsrK2OevMy72fW/OrarWan8ne5SDzWwJ19y8UO\nzIcETJtn5EqzfHrp7656846xaNZ0FqVjQ+Ai+nMc/OCJD2ZkHShpDi7tikbEVxB/\nA2DYIqidAgMBAAECggEAPTJC/Xedjx6h6xrRPjo/Pd5/ETiFuuqme2yEyJbHY1tT\nWImMyFz+0S4DqRtOABn6Hv6IDAFF2YNq2VBIt0vDg5Ehoe1lKeE/4JFRUGvIDhtj\nZfzW0fCT9VG092b2r7TB4nTQlzCL72PE7E1y13zzT7ojGsFd/2pEDWSDePOHxO/V\nw7OQoToFHMwg5bqPBjhuD68o+YoPyu/F9SgbMnTx9+wCXJvMt5gMBYUpTsS1/5lE\n45MiV+wUJz//ob1TqJ4tJ2QI+AZ83c/oeeUxZsDBp3M7+mczS67KICdwCfPIwNVk\nqEwbqqUXfZNKG0x0tutGPFTw49lT6nHDtkT7maSL0wKBgQD8BAq5RFj/vuxCmVZj\nUeJFTOo2ymYTclc1NicecYBci39LmZt3EJHGFVdsZvjAWCUkRf/vQpAlia2qjXQ4\nonTS8QtJAgPviEh9ztVGC1N5dAGlc4aQQBo4Qnk6+GaO3322lVCN8CdvT6bpaS8w\ngtBvG2X1gnElD5ifGK53BDaNUwKBgQD77TAVWoGYSdPX1pRvJV17vB0gpW/zObcK\nfpBOnPdc01PEX5DayKIcOOgFW0WackItCM+E2Ccnt7n7JqtVdKVfnExNW8EnPwZD\nAKZZJ3rrQXKflpzqW0hOTiwbO+OMubWR7MywEX1MqJLIVCWD8PzbgMlIS1TItipx\nXhbD/9FETwKBgQCCnN2p84Bk2+C7C5m4VAH/hMOGrhOFVKdaDrzrjEvIqwvIdM4c\nQVwr23e52QxnM8fcKuNgb5Ehw19cm392ssv1X7RHnGHJzUo02fOzH7+dnMAVrfA5\n5t8v9VO7em488hvHe0+KoMLvb8rEAh3Q+JtqWjrXqUlWueSR4ErbqDVVvQKBgCBz\nizAU+oCdcfZpo7E1hPc9YhskdGlGU/e8GeamfY6tgirXjJdCJO+xvOGDwlGEylV2\nvxSDq3eISSK69nMJlYvdXE7StOzTR4E2AjeVyFWplpRMGGZv376Gf1P6wPMNsP/d\nGvjLJ/LJ/C5l+HcogcncqxDu8zrvjEQSNKiGuXQtAoGBAMPu5Irv4pIFKx8oQ3dP\n92m2wwQE2KYvroCeDzwImyJB2IfJpbWkUJ1Zz5tHv1a6ZehuPiC8L5wErLSMDAxm\nXGAFN+wsqvm4lRx0IifjgxowfRYPB6BSMWpwFygb+Q4UaJ42TVH6qjL1mFr+ssMW\n8oyDWevg6hGo+/9iXyswPtKn\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-nsu5c@p-tue-61704.iam.gserviceaccount.com',
  client_id: '102756921746104281818',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-nsu5c%40p-tue-61704.iam.gserviceaccount.com',
};



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dali-6amhealth.firebaseio.com',
});

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
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/tussle-9p';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

app.use('/users', userRouter);
app.use('/dev', devRouter);

// ping the server every 20 minutes so heroku stays awake

//NEED TO PUT IN OUR SERVER NAME
setInterval(() => {
  axios.get('https://server-6amhealth.herokuapp.com/dev');
}, 1200000); // every 5 minutes (300000)

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
