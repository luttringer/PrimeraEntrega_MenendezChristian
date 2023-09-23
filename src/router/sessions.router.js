import { Router } from "express";
import passport from "passport";

const router = Router();

router.post('/register',passport.authenticate('register', {failureRedirect:'/api/sessions/authFail', failureMessage:true}), async(req,res)=>
{
    res.status(200).send({status:"success", payload:req.user._id});
})

router.post('/login',passport.authenticate('login', {failureRedirect:'/api/sessions/authFail', failureMessage:true}), async(req,res)=>
{
    req.session.user = req.user;
    res.status(200).send({status:"success", message:"logeado"});
})

router.get('/authFail', (req,res)=>
{
    console.log(req.session.message);
    res.status(401).send({status:"error", error:"Error de autenticación"});
})

router.get('/logout', async(req,res)=>
{
    req.session.destroy(error=>
    {
        if(error) console.log(error); 
        return res.redirect('/');
    });
})

export default router;