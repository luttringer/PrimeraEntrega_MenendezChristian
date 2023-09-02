import { Router } from "express";
import CartsManager from "../dao/mongo/managers/cartsManager.js";

const router = Router();
const cartsService = new CartsManager(); 

router.get('/', async(req, res)=>{                                               
    const carts = await cartsService.getCarts();                   
    res.send({status:"success", payload:carts});                             
});

router.post('/', async(req,res)=>                   
{       
    const { products } = req.body;
    if(!products) return res.status(400).send({status:"error",error:"cart incompleto"});
    const newCart = 
    {
        products
    }

    const result = await cartsService.addCart(newCart);
    res.send({status:"success", payload:result._id});
});

router.put('/:cid', async(req, res)=>{   
    const {cid} = req.params;
    const { products } = req.body;
    
    const updateCart= {
        products
    }
    
    const cart = await cartsService.getCartsBy({_id:cid});
    if(!cart) return res.status(400).send({status:"error", error:"Cart incorrecto"});
    await cartsService.updateCart(cid, updateCart);
    res.send({status:"success", message:"cart actualizado"});
});

router.delete('/:cid', async(req, res)=>{  
    const {cid} = req.params;
    const result = await cartsService.deleteCart(cid);
    res.send({status:"success", message:"Cart eliminado"});
});   

export default router;