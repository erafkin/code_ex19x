import User from '../models/user_model';


export const getNetid = (payload) =>{
    return new Promise((resolve, reject)=>{
        let name = payload.split();
        name[name.length-1]=name[name.length-1].substring(0, name.indexOf('@'));
        let users = [];
        console.log("payload name: " + payload.name);

        //search by last name
        users.push(User.find({"last_name":name[name.length-1]}));
        if(users.length>1){
            users = [];
            users.forEach(function(u){
                //search by first name -- people could have more than 1 first name so use .includes
                if(u["first_name"].includes(names[0])){
                    users.push(u);
                }
            });
            if(users.length>1){
                if(name.length>2){
                     //search by middle name -- people could have more than 1 so use .includes

                    users.forEach(function(u){
                        if(u["middle_name"].includes(names[2])){
                            users.push(u);
                        }
                    });
                    if(users.length===1){
                        resolve(users[0]["netid"]);
                    }else{
                        reject(new Error(`user with name ${payload}" not found`));
                    }
                }else{
                    if(users.length===1){
                        console.log("netid " + users[0]["netid"]);
                        resolve(users[0]["netid"]);
                    }else{
                        reject(new Error(`user with name ${payload}" not found`));
                    }
                }
            }
            
        }else{
            if(users.length===1){
                console.log("netid " + users[0]["netid"]);
                resolve(users[0]["netid"]);
            }else{
                reject(new Error(`user with name ${payload}" not found`));
            }
        }

    });
    

};
export const getCrushes = (user) => {
    return new Promise((resolve, reject) => {
        // grab user object or send 404 if not found
        
        User.findOne({ "email": user }, {"crushes":1})
          .then((foundCrushes) => {
            if (foundUser !== null) {
              resolve(foundCrushes);
            } else {
              reject(new Error(`User with email: ${user} not found`));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
};
export const getCrushNumber = (user) => {
    return new Promise((resolve, reject) => {
        // grab user object or send 404 if not found
        
        User.findOne({ "email": user }, {"crushNumber":1})
          .then((foundCrushes) => {
            if (foundCrushes !== null) {
              resolve(foundCrushes);
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
        User.findOne({ "email": user }, {"matches":1})
          .then((foundMatches) => {
            if (foundUser !== null) {
              resolve(foundMatches);
            } else {
              reject(new Error(`User with email: ${user} not found`));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
};

//update user's crush list, but also update crush's crushingNumber
const updateCrushes = (user, crush) => {
    return new Promise((resolve, reject) => {
      let crushes = User.findOne({ "email": user },{"crushes":1})
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
        
    const cn = User.findOne({"email": crush}, {"crushingNumber":1})+1;
    User.updateOne({ "email": crush }, {"crushingNumber": cn})
        .then(() => {
          // grab user object or send 404 if not found
          User.findOne({ "email": crush })
            .then((foundUser) => {
              if (foundUser !== null) {
                resolve(foundUser);
              } else {
                reject(new Error(`User with email: ${crush} not found`));
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
      let matches = User.findOne({"email": user },{"matches":1});
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
  