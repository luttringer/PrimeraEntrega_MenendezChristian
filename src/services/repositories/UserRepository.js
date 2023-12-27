export default class UserRepository
{
    constructor(dao)
    {
        this.dao = dao;
    }

    getUserById = (idUser) =>
    {
        return this.dao.getUserById(idUser);
    }
    
    getUserByEmail = (emailUser) =>
    {
        return this.dao.getByMongose(emailUser);
    }

    getUserByResetToken = (token) => 
    {
        return this.dao.getUserByResetToken(token);
    }
    
    changeUserRole = (userId) =>
    {
        return this.dao.changeUserRole(userId);
    }

    updateUser = (userId, update) =>
    {
        return this.dao.updateUser(userId, update);
    }

    updateLastConnection = (userId)=>
    {
        return this.dao.updateLastConnection(userId);
    }

    getAllUsersInfo = ()=> 
    {
        return this.dao.getAllUsersInfo();
    }

    deleteInactiveUsers = ()=> 
    {
        return this.dao.deleteInactiveUsers();
    }

    sendDeletionNotification = (email)=> 
    {
        return this.dao.sendDeletionNotification(email);
    }

    deleteUserByEmail = (email)=> 
    {
        return this.dao.deleteUserByEmail(email);
    }
}