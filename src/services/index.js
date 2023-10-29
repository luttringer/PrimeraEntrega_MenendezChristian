import ProductService from "./ProductService.js";
import CartService from "./CartService.js";
import PersistenceFactory from "../dao/PersistenceFactory.js";

const { productsDao, cartsDao } = await PersistenceFactory.getPersistence();

export const productService = new ProductService(new productsDao());
export const cartService = new CartService(new cartsDao());