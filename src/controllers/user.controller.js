import { userService } from "../services/index.js";
import MailingService from '../services/MailingService.js';
import auth from "../services/auth.js";
import crypto from 'crypto';
import mongoose, { Types } from 'mongoose';

const generateResetToken = () => {return crypto.randomBytes(20).toString('hex')};

const restartPass = async (req, res) => 
{
    try 
    {
        const userEmail = req.params.email;
        const user = await userService.getUserByEmail({ email: userEmail });

        if (!user) 
        {
            return res.status(404).json({ message: 'Correo electrónico no encontrado' });
        }

        const resetToken = generateResetToken();
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token válido por 1 hora

        // Guarda el token y su fecha de vencimiento en el usuario
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetLink = `http://localhost:8080/api/users/resetPassword?token=${resetToken}`; // Sustituye por tu dominio

        const mailService = new MailingService();

        const mailRequest = 
        {
            from: 'e-commerce wine uruguay',
            to: userEmail,
            subject: 'Link de restablecimiento de contraseña',
            html:
            `
                <h1>Su cuenta ha solicitado un restablecimiento de contraseña</h1>
                <p>Si usted no solicitó ningún cambio de contraseña, póngase en contacto con la administración de e-commerce wine Uruguay para que le asesoren sobre el caso y no realice ninguna acción respecto a este correo.</p>
                <a target="_blank" href="${resetLink}"><button>Restablecer contraseña</button></a>  
            `
        }

        const mailResult = await mailService.sendMail(mailRequest);

        return res.status(200).json({ message: 'Correo de restablecimiento enviado con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const renderResetPasswordPage = async (req, res) => 
{
    if (req.method === 'GET') 
    {
        const resetToken = req.query.token;
        return res.render('resetPassword', { resetToken });
    } else if (req.method === 'POST') 
    {
        // Procesar el formulario enviado con la nueva contraseña
        const resetToken = req.body.resetToken;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        try {
            const user = await userService.getUserByResetToken(resetToken);

            if (!user || user.resetTokenExpiry < new Date()) {return res.status(400).json({ message: 'Tiempo de restablecimiento expirado o usuario invalido'});}

            // Verificar que las contraseñas coincidan
            if (newPassword !== confirmPassword) {return res.status(400).json({ message: 'Las contraseñas no coinciden' });}

            const hashedPasword = await auth.createHash(newPassword); 

            user.password = hashedPasword;
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();

            return res.status(200).json({ message: 'Contraseña restablecida con exito' });
        } catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

const changeUserRole = async (req, res) => 
{
    try 
    {
        const userId = req.params.uid;
        const updatedUser = await userService.changeUserRole(userId);
  
        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado o sin documentos requeridos cargados' });
        return res.status(200).json({ message: 'Rol de usuario actualizado exitosamente', user: updatedUser });
    } catch (error) 
    {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateDocumentsRegister = async (req, res) => 
{
    try 
    {
        const uid = req.params.uid;
        let arr_updates = [];

        req.files.forEach(file => 
        {
            if (file.originalname && file.filename) 
            {
                arr_updates.push({
                    name: file.filename,
                    reference: file.originalname
                });
            }
        });

        const updatedUser = await userService.updateUser(uid, arr_updates);
        res.status(200).send("Documentos subidos exitosamente");
    } catch (error) {
        console.error('Error al actualizar el registro de documentos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
};

const renderFormDocuments = async (req,res) => 
{
    const userId = req.params.uid;
    res.render('documents', { userId });
}

const allUsers = async (req, res) => 
{
    try 
    {
        const allUsersInfo = await userService.getAllUsersInfo();
        if (req.method === 'GET') res.status(200).send(allUsersInfo);
        else if(req.method === 'DELETE')
        {
            const inactiveUsers = allUsersInfo.filter(user => 
            {
                const lastConnectionDate = new Date(user.last_connection);
                const twoDaysAgo = new Date();
                twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                return !user.last_connection || lastConnectionDate < twoDaysAgo;
            });

            if (inactiveUsers.length > 0) 
            {
                await Promise.all(
                    inactiveUsers.map(async (user) => 
                    {
                        await userService.sendDeletionNotification(user.email);
                        await userService.deleteUserByEmail(user.email);
                    })
                );
            }

            res.status(200).send('Usuarios borrados satisfactoriamente');
        }
        
    } catch (error) 
    {
        res.status(500).send('Error interno del servidor');
    }
};
  

export default 
{
    restartPass,
    renderResetPasswordPage, 
    changeUserRole,
    renderFormDocuments,
    updateDocumentsRegister,
    allUsers
}