

export default class ProductService
{
    constructor(manager)
    {
        this.manager = manager;
    }

    getViewsProducts = (limit, page, queryObject, sort)=>
    {
        return this.manager.getViewsProducts(limit, page, queryObject, sort);
    }
}