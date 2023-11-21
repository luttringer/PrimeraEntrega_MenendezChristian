export default class UserRepository
{
    constructor(dao)
    {
        this.dao = dao;
    }

    getUserByEmail = (emailUser) =>
    {
        return this.dao.getByMongose(emailUser);
    }

    getUserByResetToken = (token) => 
    {
        return this.dao.getUserByResetToken(token);
    }
}