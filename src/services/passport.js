import passport from 'passport';
import cas from 'passport-cas';

import dotenv from 'dotenv';

// loads in .env file if needed
dotenv.config({ silent: true });

const casOptions = {
  ssoBaseURL: 'https://login.dartmouth.edu/cas',
//   serverBaseURL: 'http://localhost:3000/cas',
};
const casLogin = new cas.Strategy(casOptions, (user, done) => {
  return done(null, user);
});
// Tell passport to use this strategy
passport.use(casLogin);


export default passport;