import passport from "passport";
import local from 'passport-local';
import UserManager from "../dao/mongo/managers/userManager.js";
import auth from "../services/auth.js";


const LocalStrategy = local.Strategy; //local = user + pass
const usersServices = new UserManager();

const initializeStrategies = ()=> 
{
    passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField:'email'}, async (req,email,password,done)=>
    {
        //register logic
        const {firstName, lastName, age} = req.body;
        if(!firstName || !lastName || !email || !age || !password) return done(null,false, {message: "incomplete values"})
        
        const hashedPasword = await auth.createHash(password);   //hasheo la pass
        const newUser = {firstName, lastName, email, age, password:hashedPasword};
        const result = await usersServices.create(newUser);
        done(null,result);
    }));

    passport.use('login', new LocalStrategy({usernameField:'email'}, async (email,password,done)=>
    {
        //login logic
        if(!email || !password) return done(null,false, {message: "incomplete values"})
        const user = await usersServices.getBy({email});
        if(!user) return done(null,false, {message: "incorrect credentials "})
        const isValidPassword = await auth.validatePassword(password, user.password);
        if(!isValidPassword) return done(null,false, {message: "incorrect credentials"})
        done(null,user);
    }));
}

passport.serializeUser((user,done)=>
{
    return done(null,user._id);
});

passport.deserializeUser(async(id,done)=>
{
    const user = await usersServices.getBy({_id:id});
    done(null,user);
});

export default initializeStrategies;