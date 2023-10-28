import ProductManager from "../dao/mongo/managers/productsManager.js";
import CartsManager from "../dao/mongo/managers/cartsManager.js";

const productsService = new ProductManager();   
const cartsService = new CartsManager(); 

const getViewsProducts = async (req, res) => 
{
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const sort = req.query.sort || 'asc';
    const category = req.query.category || null; 
    const status = req.query.status || null;     

    const queryObject = {};

    if (category) queryObject.category = category;
    if (status) queryObject.status = status; 

    try {
        const products = await productsService.getViewsProducts(limit, page, queryObject, sort);

        res.render('Products', 
        {
            user: user,
            filterProducts: products.filterProducts,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            totalPages: products.totalPages
        });
    } catch (error) 
    {
        // Manejo de errores, puedes enviar una respuesta de error o registrar el error
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const getCartsById = async (req, res) => 
{
    const carrito_id = req.params.cid;
    const filter = { _id: carrito_id }; // Crea un objeto de filtro con el campo "_id" y el valor del ID
    const cart = await cartsService.getCartsBy(filter);

    res.render('Carts', {
        cart
    });
};

export default 
{
    getViewsProducts,
    getCartsById
}