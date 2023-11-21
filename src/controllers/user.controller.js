import { userService } from "../services/index.js";

const restartPass = async (req, res) => 
{
    const userEmail = req.params.email;
    const user = await userService.getUserByEmail({ email: userEmail });

    
    if (!user) 
    {
        return res.status(404).json({ msj: 'Correo electrónico no encontrado' });
    }else 
    {
        return res.status(200).json({ msj: 'Correo electrónico encontrado' });
    }

};

export default 
{
    restartPass
}