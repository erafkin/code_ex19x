import express from 'express';
import * as User from './controllers/user_controller';
import passport from './services/passport';
const router = express();

router.route('/')
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
            //getCrushes of crush, search for match, update accordingly
            
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