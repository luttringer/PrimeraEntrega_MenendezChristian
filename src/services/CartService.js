export default class CartService
{
    constructor(manager)
    {
        this.manager = manager;
    }

    getCartWithDetails = (filter)=>
    {
        return this.manager.getCartWithDetails(filter);
    }
}