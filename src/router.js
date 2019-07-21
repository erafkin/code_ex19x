import { Router } from 'express';
import path from 'path';
import * as UserID from './controllers/user_controller';
import passport from './services/passport';
const router = Router();


//FIX:
//CAS is sending through the user in the form of --Emma P. Rafkin@DARTMOUTH.EDU--
//this is not helpful and doesnt really match to anything. we need to figure out how to get the server to send the netid or email 

//before any call, we need to call user.getNetid to switch the form from the gross cas thing to the netid


//lol not actually logging them out because idk how to do that, but just rerouting them--hacks
router.route('/logout').get((req, res) => {
  res.send('Thanks for visiting last chances 19x!');
});



//global variables
let crush_list_final = []; 
let match_list_final = [];
let user_final = undefined;
let netid_final = "";
let crush_number_final = 0;

//main call, get all of the info that we will need to display and save them as variables.
router.route('/')
    .get((req, res, next)=>{

    //cas auth
    passport.authenticate('cas', (err, user, info)=>{
        user_final = user;
        console.log("user: "+user);
        if(err){return err;}
        if(!user){
            console.log("rejected");
            return res.redirect('/');
        }
        let netid = "";
        //get the net id of the user that CAS returns
        UserID.getNetid(user)
            .then((ni)=>{
                    //do we need to copy this?
                    netid = ni.slice();
                    //get the list of crushes
                    UserID.getCrushes(netid).then((crush_list)=>{
                        //get the list of matches
                        UserID.getMatches(netid).then((match_list) =>{
                            //get number of people crushing on them
                            UserID.getCrushNumber(netid)
                            .then((crushes)=>{
                                //save everything to the global variables
                                netid_final = netid;
                                crush_list_final = crush_list;
                                match_list_final = match_list;
                                crush_number_final = crushes;

                                //redirect them!
                                res.redirect('/entry');
                            })
                            .catch((error)=>{
                                res.status(500).send(error.message);
                            });
                        }).catch((error)=>{
                            res.status(500).send(error.message);
                        });
                        
                    }).catch((error)=>{
                        res.status(500).send(error.message);
                    });
                })        
            .catch((error)=>{
                res.status(500).send(error.message);
            });
    })(req, res, next);
    })


    //this is the main page that will actualy display, otherwise the CAS auth ticket is still in the url and you can't reload which is annoying
    router.route('/entry').get((req, res)=>{
        //format the name that is the CAS response
        if(user_final===undefined){
            res.redirect("/");
        }else{
            let name = JSON.stringify(user_final);
            name = name.slice();
            name = name.substring(1, name.length);
            name=name.substring(0, name.indexOf('@'));
            //render the main page!
            res.render('index', {"crushes": crush_number_final, "user": name, "crush_list": crush_list_final, "match_list": match_list_final});
        }
        
    });




    //ONLY A POST ENDPOINT
    // to update the crushes, matches, and crush number 
    router.route('/crushes')
    .post((req, res, next) => {
    //I call it req.body.crush as in that is what I'm assuming will be the crush's id
        let crush = req.body.entry;
        let crush_id = "";
        UserID.legalNametoNetid(crush)
        .then((id)=>{
            crush_id=id;
            UserID.getCrushes(crush_id)
                .then((results) => {
                    let user_legal_name = "";
                    UserID.netidToLegalName(netid_final).then((uln)=>{
                        user_legal_name = uln;
                        if(results.includes(user_legal_name)){
                            UserID.updateMatches(user_legal_name, crush);
                            UserID.updateMatches(crush, user_legal_name);
                            UserID.updateCrushes(netid_final, crush);
                        }else{
                            UserID.updateCrushes(netid_final, crush);
                        }
                        res.redirect('/');
                    }).catch((error) => {
                        res.status(500).send(error.message);
                    });
                    
                })
                .catch((error) => {
                    res.status(500).send(error.message);
                })
        }).catch((error)=>res.status(500).send(error.message));

        //somehow need to validate that the crush is a real person and get their netid from that--another user_controller method?
            

        });

export default router;