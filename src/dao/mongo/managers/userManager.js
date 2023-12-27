import userModel from "../models/user.js";
import MailingService from '../../../services/MailingService.js';

export default class UserManager
{
    get =()=>
    {
        return userModel.find().lean();
    }

    getBy =(param)=>
    {
        return userModel.findOne(param).lean();
    }

    getByMongose =(param)=>
    {
        return userModel.findOne(param);
    }

    deleteUserByEmail = (email) => 
    {
        return userModel.deleteOne({ email: email });
    }

    create = (user)=>
    {
        user.role = 'user';
        return userModel.create(user);
    }

    getUserByResetToken = (token) => 
    {
        return userModel.findOne({ resetToken: token });
    }

    changeUserRole = async (userId) => {
        try {
            const user = await userModel.findById(userId);
        
            if (!user) return null;
        
            // Verifica si el usuario tiene todos los documentos requeridos
            const requiredDocumentNames = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const hasAllDocuments = requiredDocumentNames.every(docName => {
                return user.documents.some(userDoc => userDoc.name.includes(docName));
            });
        
            if (!hasAllDocuments) {return null}
        
            // Actualiza el rol solo si tiene todos los documentos
            user.role = user.role === 'user' ? 'premium' : 'user';
            const updatedUser = await user.save();
            return updatedUser;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    

    getUserById = async (userId) => 
    {
        try 
        {
            const user = await userModel.findOne({ '_id': userId });
            return user;
        } catch (error) 
        {
            throw error;
        }
    }
    
    updateUser = async (userId, updates) => {
        try {
            const user = await userModel.findById(userId);
    
            if (!user) return null;
            if (!Array.isArray(user.documents)) {user.documents = [];}

            user.documents.push(...updates);
            const updatedUser = await user.save();
    
            return updatedUser;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error.message);
            throw error;
        }
    }

    updateLastConnection = async(userId)=>
    {
        try 
        {
            const user = await userModel.findById(userId);
    
            if (user) 
            {
                user.last_connection = new Date();
                await user.save();
            }
        } catch (error) 
        {
            console.error(error);
        }
    }
    
    getAllUsersInfo = async () => 
    {
        try 
        {
            const users = await userModel.find().select('firstName email role last_connection').lean();
            return users;
        } catch (error) 
        {
            console.error('Error al obtener la información de todos los usuarios:', error.message);
            throw error;
        }
    }

    deleteUserByEmail = async (email) => 
    {
        try 
        {
            const deletedUser = await userModel.findOneAndDelete({ email: email });
            return deletedUser;
        } catch (error) 
        {
            console.error('Error al borrar usuario por correo electrónico:', error.message);
            throw error;
        }
    }
    
    sendDeletionNotification = async (userEmail) => 
    {
        try 
        {
            const mailService = new MailingService();
            const mailRequest = 
            {
                from: 'e-commerce wine uruguay',
                to: userEmail,
                subject: 'su cuenta ha sido eliminada por inactividad',
                html:
                `
                    <p>Usted está formalmente notificado, por este medio, de que su cuenta ha sido eliminada de nuestra plataforma e-commerce WineUruguay debido a la detección de su inactividad.<br>Atte. equipo WineUruguay</p>
                `
            }
            const mailResult = await mailService.sendMail(mailRequest);
        } catch (error) {
            console.error('Error al enviar el correo de notificación:', error.message);
            throw error;
        }
    };

}