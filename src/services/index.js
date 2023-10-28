import ProductService from "./ProductService.js";
import ProductManager from "../dao/mongo/managers/productsManager.js";

import CartService from "./CartService.js";
import CartsManager from "../dao/mongo/managers/cartsManager.js";

export const productService = new ProductService(new ProductManager());
export const cartService = new CartService(new CartsManager());