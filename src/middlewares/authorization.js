/*const authorization = (role)=>
{
    return async(req,res,next)=>
    {
        console.log(req.user);
        if(!req.user) return res.status(401).send({status:'error', error:"Unauthorized."});

        if (!role.includes(req.user.role))  return res.status(403).send({status:'error', error:"Forbidden."});
        
        next();
    }
}

export default authorization;*/

import jwt from 'jsonwebtoken';

const authorization = (allowedRoles) => {
    return (req, res, next) => {
        // Obtener token desde la cookie
        const authCookie = req.cookies.authCookie;

        if (!authCookie) {
            return res.status(401).send({ status: 'error', error: 'No estás logueado' });
        }

        try {
            // Verificar el token
            const userInfo = jwt.verify(authCookie, 'buhoS3cr3t');

            // Verificar si el rol del usuario está permitido
            if (allowedRoles.includes(userInfo.role)) {
                req.user = userInfo;
                next();
            } else {
                return res.status(403).send({ status: 'error', error: 'No tienes los permisos necesarios' });
            }
        } catch (error) {
            console.error(error);
            return res.status(401).send({ status: 'error', error: 'Error de autenticación' });
        }
    };
};

export default authorization;

