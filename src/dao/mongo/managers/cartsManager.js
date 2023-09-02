import cartsModel from "../models/carts.js";

export default class CartsManager
{
    getCarts = ()=>
    {
        return cartsModel.find().lean();
    }

    getCartsBy = (params)=>
    {
        return cartsModel.findOne(params).lean(); 
    }

    addCart = (cart)=>
    {
        return cartsModel.create(cart);
    }

    updateCart = (id, cart)=>
    {
        return cartsModel.updateOne({_id:id},{$set:cart});
    }

    deleteCart = async (id) => 
    {
        try {
            const deletedCart = await cartsModel.findByIdAndDelete(id); 
            if (!deletedCart) {
                throw new Error(`No se encontró el cart con ID ${id}`);
            }
            return deletedCart;
        } catch (error) {
            throw error;
        }
    }
}