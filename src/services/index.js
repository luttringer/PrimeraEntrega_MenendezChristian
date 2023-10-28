import ProductService from "./ProductService.js";
import ProductManager from "../dao/mongo/managers/productsManager.js";

export const productService = new ProductService(new ProductManager());