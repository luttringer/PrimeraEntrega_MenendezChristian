import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productsManager.js";
import CartsManager from "../dao/mongo/managers/cartsManager.js";

const router = Router();
const cartsService = new CartsManager(); 
const productsService = new ProductManager();   

router.get('/products', async (req,res)=>{
    const products = await productsService.getProducts();
    res.render('Products', {
        products
    });
});

router.get('/carts', async (req,res)=>{
    const carts = await cartsService.getCarts();
    res.render('Carts', {
        carts
    });
});

export default router;
