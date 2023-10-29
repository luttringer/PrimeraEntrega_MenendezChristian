export default class CartRepository
{
    constructor(dao)
    {
        this.dao = dao;
    }

    getCartWithDetails = (filter)=>
    {
        return this.dao.getCartWithDetails(filter);
    }
}