import { Router } from 'express';
import * as UserID from './controllers/user_controller';
import passport from './services/passport';


var request = require('request');
const router = Router();



router.route('/logout').get((req, res) => {
  res.send('Thanks for visiting last chances 19x!');
});




//main call, get all of the info that we will need to display and save them as variables.
router.route('/')
    .get((req, res, next)=>{
        //global variables
    let crush_list_final = []; 
    let match_list_final = [];
    let user_final = undefined;
    let netid_final = "";
    let crush_number_final = 0;

    //cas auth
    passport.authenticate('cas', (err, user, info)=>{
        user_final = user;
        req.session["user_final"] = user_final;
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
                                console.log("does this happen");
                                netid_final = netid;
                                crush_list_final = crush_list;
                                match_list_final = match_list;
                                crush_number_final = crushes;
                                req.session["netid_final"] = netid_final;
                                console.log(req.session["crush_list_final"]);
                                req.session["crush_list_final"] = crush_list_final;
                                console.log(req.session["crush_list_final"]);

                                req.session["crush_number_final"] = crush_number_final;
                                req.session["match_list_final"] = match_list_final;
                                req.session.save(function(err) {
                                    // session updated
                                  })


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
        if(req.session["user_final"]===undefined){
            res.redirect("/");
        }else{
            let name = JSON.stringify(req.session["user_final"]);
            name = name.slice();
            name = name.substring(1, name.length);
            name=name.substring(0, name.indexOf('@'));
            //render the main page!
            res.render('index', {"crushes": req.session["crush_number_final"], "user": name, "crush_list": req.session["crush_list_final"], "match_list": req.session["match_list_final"]});
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
                            
                            if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
                                res.redirect('/');
                            }
                            // Put your secret key here.
                            var secretKey = "6LeLx64UAAAAAHgfKOR5zl8e8TWms5su7tkadBP9";
                            // req.connection.remoteAddress will provide IP address of connected user.
                            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
                            // Hitting GET request to the URL, Google will respond with success or error scenario.
                            request(verificationUrl,function(error,response,body) {
                                body = JSON.parse(body);
                                // Success will be true or false depending upon captcha validation.
                                if(body.success !== undefined && !body.success) {
                                res.redirect('/');
                                }else{
                                    let user_legal_name = "";
                                    UserID.netidToLegalName(req.session["netid_final"]).then((uln)=>{
                                        user_legal_name = uln;
                                        if(results.includes(user_legal_name)){
                                            UserID.updateMatches(user_legal_name, crush);
                                            UserID.updateMatches(crush, user_legal_name);
                                            UserID.updateCrushes(req.session["netid_final"], crush);
                                        }else{
                                            UserID.updateCrushes(req.session["netid_final"], crush);
                                        }
                                        res.redirect('/');
                                    }).catch((error) => {
                                        res.status(500).send(error.message);
                                    });
                                }
                            });
                            
                            
                            }).catch((error) => {
                                res.status(500).send(error.message);
                            });
                            
                        })
                        .catch((error) => {
                            res.status(500).send(error.message);
                        });
    });

export default router;