export default class UserRepository
{
    constructor(dao)
    {
        this.dao = dao;
    }

    getUserByEmail = (emailUser) =>
    {
        return this.dao.getBy(emailUser);
    }
}