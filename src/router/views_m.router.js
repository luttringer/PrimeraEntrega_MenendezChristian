import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productsManager.js";
import CartsManager from "../dao/mongo/managers/cartsManager.js";
import passportCall from "../middlewares/passportCall.js";


const router = Router();
const cartsService = new CartsManager(); 
const productsService = new ProductManager();   

router.get('/products',passportCall('jwt'), async (req, res) => {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const sort = req.query.sort || 'asc';
    const category = req.query.category || null; 
    const status = req.query.status || null;     

    const queryObject = {};

    if (category) queryObject.category = category;
    if (status) queryObject.status = status; 
    
    const products = await productsService.getViewsProducts(limit, page, queryObject, sort);

    res.render('Products', {
        user:user,
        filterProducts: products.filterProducts,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages
    });
});

router.get('/carts/:cid', async (req, res) => {
    const carrito_id = req.params.cid;
    const filter = { _id: carrito_id }; // Crea un objeto de filtro con el campo "_id" y el valor del ID
    const cart = await cartsService.getCartsBy(filter);

    res.render('Carts', {
        cart
    });
});

router.get('/', passportCall('jwt'), (req, res) => 
{
    const user = req.user; 

    if (!req.cookies.authCookie || !req.user) {
        return res.redirect('/login');
    }
    
    res.render('profile', { user });          
});

router.get('/register', async(req,res)=>{
    res.render('register')
})

router.get('/login', async(req,res)=>{
    res.render('login')
})


router.get('/profilejwt',passportCall('jwt'), async(req,res)=>{
    res.render('ProfileJWT', {user: req.user});
})


export default router;
