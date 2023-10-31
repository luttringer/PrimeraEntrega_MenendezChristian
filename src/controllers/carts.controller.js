import { cartService } from "../services/index.js";

const createCartByUserId = async (req, res) => 
{
    try {
        const userId = req.user.id;
        const existingCart = await cartService.getCartByUserId(userId);

        if (existingCart) 
        {
            res.redirect(`/api/carts/${existingCart._id}`);
        } else {
            const newCart = await cartService.createCart({ user: userId });
            res.redirect(`/api/carts/${newCart._id}`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCart = async (req, res) => {
    const carrito_id = req.params.cid;

    try {
        const carritoObjeto = await cartService.getCartsByIdWithProducts(carrito_id);

        if (carritoObjeto) {
            let productos = [];
            if (carritoObjeto) productos = carritoObjeto.products;

            const cart_filtrado = 
            {
                id: carritoObjeto ? carritoObjeto._id : null,
                usuario: carritoObjeto ? carritoObjeto.user : null,
                productos: productos.map(product => ({
                    f_title: product.id_product.title,
                    f_description: product.id_product.description,
                    f_category: product.id_product.category,
                    f_code: product.id_product.code,
                    f_status: product.id_product.status,
                    f_stock: product.id_product.stock,
                    f_price: product.id_product.price,
                    f_quantity: product.quantity
                }))
            };


            
            res.render('Carts', { cart_filtrado });
        } else {
            res.status(400).json({ error: "Carrito no existe" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const updateCartProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.body.productId;

        let cart = await cartService.getCartByUserId(userId);

        if (!cart) 
        {
            console.log("No existe el carrito, se crea uno nuevo.");
            cart = await cartService.createCart({ user: userId, products: [{ id_product: productId, quantity: 1 }] });
        } else 
        {
            const updateCart = await cartService.updateProductQuantity(cart._id, productId, 1);
        }

        res.status(200).send("Producto actualizado en el carrito");

    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
}


export default 
{
    createCartByUserId,
    getCart,
    updateCartProducts
}