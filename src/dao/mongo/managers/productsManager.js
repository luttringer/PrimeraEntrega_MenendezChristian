import productsModel from "../models/products.js";          //desarrollo un mmanager para no interactuar directamente con el modelo

export default class ProductManager
{
    getProducts = ()=>
    {
        return productsModel.find().lean();
    }

    getProductsBy = (params)=>
    {
        return productsModel.findOne(params).lean(); 
    }

    addProduct = (product)=>
    {
        return productsModel.create(product);
    }

    updateProduct = (id, product)=>
    {
        return productsModel.updateOne({_id:id},{$set:product});
    }

    deleteProduct = async (id) => 
    {
        try {
            const deletedProduct = await productsModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error(`No se encontró el producto con ID ${id}`);
            }
            return deletedProduct;
        } catch (error) {
            throw error;
        }
    }
}