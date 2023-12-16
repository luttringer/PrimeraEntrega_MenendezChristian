import userModel from "../models/user.js";

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
        
            if (!hasAllDocuments) {
                console.log("llego aca");
                return null;
            }
        
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
    
          if (user) {
            user.last_connection = new Date();
            await user.save();
          }
        } catch (error) {
          // Maneja el error
          console.error(error);
        }
      }

}