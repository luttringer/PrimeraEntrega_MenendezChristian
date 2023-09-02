import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productsManager.js";
import uploader from "../services/uploadServices.js";

const router = Router();
const productsService = new ProductManager();                                   //instancio objeto de clase del manager de videogames

router.get('/', async(req, res)=>{                                                //endpoint para get raiz
    const products = await productsService.getProducts();                   //declaro constante como promesa(callback?) de metodo getVideogames de la clase
    res.send({status:"success", payload:products});                              //devuelvo todos los videojuegos
});

router.post('/', uploader.array('thumbnail'),async(req,res)=>                      //cargo un middlewar intermedio que invoque a mi uploader para trabajar con el archivo que me enviaran
{       
    const { title, description, category, code, status, price, stock} = req.body;
    if(!title || !description || !category || !code || !status || !price || !stock) return res.status(400).send({status:"error",error:"producto incompleto"});
    const newProduct = 
    {
        title,
        description,
        category,
        code,
        status,
        price,
        stock
    }
    const thumbnail = req.files.map(file=>`${req.protocol}://${req.hostname}:${process.env.PORT||8080}/img/${file.filename}`)
    newProduct.thumbnail = thumbnail;

    const result = await productsService.addProduct(newProduct);
    res.send({status:"success", payload:result._id});
});

router.put('/:pid', async(req, res)=>{   
    const {pid} = req.params;
    const { title, description, category, code, status, price, stock} = req.body;
    
    const updateProduct= {
        title,
        description,
        category,
        code,
        status,
        price,
        stock
    }
    
    const product = await productsService.getProductsBy({_id:pid});
    if(!product) return res.status(400).send({status:"error", error:"Producto incorrecto"});
    await productsService.updateProduct(pid, updateProduct);
    res.send({status:"success", message:"producto actualizado"});
});

router.delete('/:pid', async(req, res)=>{  
    const {pid} = req.params;
    const result = await productsService.deleteProduct(pid);
    res.send({status:"success", message:"Producto eliminado"});
});                      
                         
export default router;