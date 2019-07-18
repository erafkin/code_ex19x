import User from '../models/user_model';

export const getCrushes = (user) => {
    return new Promise((resolve, reject) => {
        // grab user object or send 404 if not found
        
        User.findOne({ "email": user })
          .then((foundUser) => {
            if (foundUser !== null) {
              resolve(foundUser.crushes);
            } else {
              reject(new Error(`User with email: ${user} not found`));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
};
export const getMatches = (user) => {
    return new Promise((resolve, reject) => {
        // grab user object or send 404 if not found
        User.findOne({ "email": user })
          .then((foundUser) => {
            if (foundUser !== null) {
              resolve(foundUser.matches);
            } else {
              reject(new Error(`User with email: ${user} not found`));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
};


const updateCrushes = (user, crush) => {
    return new Promise((resolve, reject) => {
      let crushes = User.findOne({ "email": user }).crushes;
      crushes = crushes.push(crush);
      User.updateOne({ "email": user }, {"crushes": crushes})
        .then(() => {
          // grab user object or send 404 if not found
          User.findOne({ "email": user })
            .then((foundUser) => {
              if (foundUser !== null) {
                resolve(foundUser);
              } else {
                reject(new Error(`User with email: ${user} not found`));
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };


  const updateMatches = (user, match) => {
    return new Promise((resolve, reject) => {
      let matches = User.findOne({"email": user }).matches;
      matches.push(match);
      User.updateOne({ "email": user }, {"matches": matchArray})
        .then(() => {
          // grab user object or send 404 if not found
          User.findOne({ "email": user })
            .then((foundUser) => {
              if (foundUser !== null) {
                resolve(foundUser);
              } else {
                reject(new Error(`User with email: ${user} not found`));
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  