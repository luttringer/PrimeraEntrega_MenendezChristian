import mongoose from "mongoose";

const collection = "carts"; 
const productSchema = new mongoose.Schema({
    id_product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const schema = new mongoose.Schema({
    products: {
        type: [productSchema],
        required: true
    }                          
}, { timestamps: true });                               

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;