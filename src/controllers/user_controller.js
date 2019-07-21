import User from '../models/user_model';
import { model } from 'mongoose';


//TODO: switch out all the find by emails to find by net id


//returns the netid of the user based on the payload
export const getNetid = (payload) =>{
    return new Promise((resolve, reject)=>{
        let name = JSON.stringify(payload);
        name = name.slice();
        name = name.replace(".", "");
        name = name.substring(1, name.length);
        name=name.substring(0, name.indexOf('@'));
        name = name.replace(/ /g,".");
        User.findOne({ "email" : {$regex: name, $options:'i'}}, {"netid":1})
            .then((foundNetID) =>{
                if (foundNetID !== null) {
                    resolve(foundNetID["netid"]);
                  } else {
                    reject(new Error(`User with email: ${foundNetID["netid"]} not found--is this the error?`));
                  } 
            })
            .catch((error) => {
                reject(error);
              })
        
    })};    



export const getCrushes = (user) => {
    return new Promise((resolve, reject) => {
        // grab user object or send 404 if not found
        
        User.findOne({ "netid": user }, {"crushes":1})
          .then((foundCrushes) => {
            if (foundCrushes !== null) {
              resolve(foundCrushes["crushes"]);
            } else {
              reject(new Error(`User with netid: ${user} not found`));
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
        
        User.findOne({ "netid": user }, {"crushingNumber":1})
          .then((foundCrushes) => {
            if (foundCrushes !== null) {
              resolve(foundCrushes["crushingNumber"]);
            } else {
              reject(new Error(`User with email: ${user} not found--testing that this is get crush number`));
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
        User.findOne({ "netid": user }, {"matches":1})
          .then((foundMatches) => {
            if (foundMatches !== null) {
              resolve(foundMatches["matches"]);
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
export const updateCrushes = (user, crush) => {

    return new Promise((resolve, reject) => {
      let crushes = [];
                User.updateOne({ "netid": user }, {$push: {"crushes" : crush}})
                    .then(() => {
                    // grab user object or send 404 if not found
                    User.findOne({ "netid": user })
                        .then((foundUser) => {
                        if (foundUser !== null) {
                            let cn = 0;
                            User.findOne({"legal_name": crush}, {"crushingNumber":1})
                                .then((number) => {
                                    cn = number["crushingNumber"];
                                    cn++;
                                    User.updateOne({ "legal_name": crush }, {"crushingNumber": cn})
                                        .catch((error) => {
                                            reject(error);
                                        });  
                                    })
                                .catch((error)=>{reject(new Error(`User with netid: ${user} not found`));})
                            } else {
                                reject(new Error(`User with netid: ${user} not found`));
                            }
                        })
                        .catch((error) => {
                            reject(error);
                        });                    
                    }).catch((error)=>reject(new Error(`couldn't find user`))); 
          
    });
  };
  export const updateMatches = (user, match) => {
    return new Promise((resolve, reject) => {
      User.updateOne({ "legal_name": user }, {$push: {"matches" : match}})
            .catch((error) => {
              reject(error);
            });
        });
  };


//getting different identifiers of the same person depending on what call we are trying to make

export const netidToLegalName = (user) => {
    return new Promise((resolve, reject)=>{
        User.findOne({"netid": user},{"legal_name": 1})
            .then((found)=>{
                console.log(found["legal_name"]);
                resolve(found["legal_name"]);
            }).catch((error)=>{
                reject(new Error(`User with netid: ${user} not found`));
            });
    });
};
export const legalNametoNetid = (user) => {
    return new Promise((resolve, reject)=>{
        User.findOne({"legal_name": user},{"netid": 1})
            .then((found)=>{
                resolve(found["netid"]);
            }).catch((error)=>{
                reject(new Error(`User with name: ${user} not found`));
            });
    });
};

  


  