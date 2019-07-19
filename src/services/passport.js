import passport from 'passport';
import cas from 'passport-cas';

import dotenv from 'dotenv';
// loads in .env file if needed
dotenv.config({ silent: true });


const casOptions = {
  ssoBaseURL: 'https://login.dartmouth.edu/cas',
//   serverBaseURL: process.env.REDIRECT_URL,
  serverBaseURL: 'http://localhost:8000/cas',
};

const casLogin = new cas.Strategy(casOptions, (user, done) => {
  console.log(`payload: ${user}`);

  return done(null, user);
});



// Tell passport to use this strategy
passport.use(casLogin);


// passport.use(new (require('passport-cas').Strategy)({
//     version: 'CAS3.0',

//   ssoBaseURL: 'https://login.dartmouth.edu/cas',
// //   serverBaseURL: process.env.REDIRECT_URL,
//   serverBaseURL: 'http://localhost:8000/cas',
//   }, function(profile, done) {
//     var netid = profile.netid;
//     console.log("profile attributes: " +profile.attributes);
//     console.log("netid: " +netid);

//     User.findOne({netid: netid}, function (err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, {message: 'Unknown user'});
//       }
//       user.attributes = profile.attributes;
//       return done(null, user);
//     });
//   }));

export default passport;