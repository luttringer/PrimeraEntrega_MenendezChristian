import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const managers = new ProductManager('products.json');
const router = Router();

router.get('/', async (req, res) => 
{
    try {
        const limit = req.query.limit; 
        let productos = await managers.getProducts();

        if (limit) {
            const parsedLimit = parseInt(limit);
            if (!isNaN(parsedLimit)) {
                productos = productos.slice(0, parsedLimit);
            } else {
                return res.status(400).json({ error: 'El valor de "limit" debe ser un número entero válido' });
            }
        }

        res.json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/:pid", async (req,res)=>
{
    const producto_id = parseInt(req.params.pid);
    const productoObjeto = await managers.getProductById(producto_id);

    if(productoObjeto)
    {
        res.json(productoObjeto);
    }else 
    {
        res.status(400).json({error: "producto no existe"});
    }
})

router.post("/", async (req, res) => 
{ 
    const nuevoProducto = req.body;
    
    try {
        const productoAgregado = await managers.addProduct(nuevoProducto);
        console.log(productoAgregado);

        io.emit('productAdded', productoAgregado);

        res.status(201).json({ status: "success", message: "Producto agregado satisfactoriamente", product: productoAgregado });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

router.put("/:pid", async (req, res) => 
{
    const producto_id = parseInt(req.params.pid);
    const updateProducto = req.body;

    try {
        const productoActualizado = await managers.updateProduct(updateProducto,producto_id);

        res.status(201).json({ status: "success", message: "Producto actualizado satisfactoriamente", product: productoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => 
{
    const producto_id = parseInt(req.params.pid);

    try {
        const productoEliminado = await managers.deleteProduct(producto_id);

        res.status(201).json({ status: "success", message: "Producto eliminado satisfactoriamente", product: productoEliminado });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});


export default router;