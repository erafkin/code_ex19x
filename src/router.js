import express from 'express';
import * as User from './controllers/user_controller';
import passport from './services/passport';
const router = express();


//FIX:
//CAS is sending through the user in the form of --Emma P. Rafkin@DARTMOUTH.EDU--
//this is not helpful and doesnt really match to anything. we need to figure out how to get the server to send the netid or email 

router.route('/')
    .get((req, res, next)=>{
    passport.authenticate('cas', (err, user, info)=>{
        console.log(user);
        console.log(User.getNetid(user));
        if(err){return next(err);}
        if(!user){
            console.log("rejected");
            return res.redirect('/');
        }
        console.log('authed:' + JSON.stringify(user) + ' with ' + JSON.stringify(req.query));
        //search mongo db for user's crushes using user_controller

        User.getCrushNumber(user)
            .then((crushes)=>{
                res.render('index', {crushes});
            })
            .catch((error)=>{
                res.status(500).send(error.message);
            })
    })(req, res, next);
    })

router.route('/crushes')
    .get((req, res, next)=>{
    passport.authenticate('cas', (err, user, info)=>{
        if(err){return next(err);}
        if(!user){return res.redirect('/');}
        console.log('authed:' + JSON.stringify(user) + ' with ' + JSON.stringify(req.query));
        //search mongo db for user's crushes using user_controller
        User.getCrushes(user)
            .then((crushes)=>{
                res.render('index', {crushes});
            })
            .catch((error)=>{
                res.status(500).send(error.message);
            })
    })(req, res, next);
    })
    .post((req, res, next)=>{
        passport.authenticate('cas', (err, user, info)=>{
            if(err){return next(err);}
            if(!user){return res.redirect('/');}
            console.log('authed:' + JSON.stringify(user) + ' with ' + JSON.stringify(req.query));

            // TODO:
            //getCrushes of crush, search for match,
            //if match: update my matches update their matches
            //finally: update my crushes
            // update accordingly (if match, call update matches on both crush and user)
            
        })(req, res, next);
        })


router.route('/matches')
    .get((req, res, next)=>{
        passport.authenticate('cas', (err, user, info)=>{
            if(err){return next(err);}
            if(!user){return res.redirect('/');}
            console.log('authed:' + JSON.stringify(user) + ' with ' + JSON.stringify(req.query));

            //search mongo db for user's crushes using user_controller
            User.getMatches(user)
                .then((response)=>{
                    res.send(response);
                })
                .catch((error)=>{
                    res.status(500).send(error.message);
                })
        })(req, res, next);
        })
export default router;