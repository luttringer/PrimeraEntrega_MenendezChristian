import passport from "passport";

const passportCall = (strategy)=>
{
    return async(req,res,next)=>
    {
        passport.authenticate(strategy,function(error,user,info)
        {
            if(error) return next(error);
            if(!user)
            {
                //si no hay usuario que levantar prefiero controlarlo desde el endpoint
                //return res.status(401).send({status:"error",error:info.message?info.message:info.toString()})
            }

            req.user = user;
            next();
        })(req,res,next);
    }
}

export default passportCall;