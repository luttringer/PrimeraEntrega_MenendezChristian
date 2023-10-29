import ProductRepository from "./repositories/ProductRepository.js";
import CartRepository from "./repositories/CartRepository.js";
import PersistenceFactory from "../dao/PersistenceFactory.js";

const { productsDao, cartsDao } = await PersistenceFactory.getPersistence();

export const productService = new ProductRepository(new productsDao());
export const cartService = new CartRepository(new cartsDao());