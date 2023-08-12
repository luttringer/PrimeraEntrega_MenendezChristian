import express from 'express';
import productRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js'
import __dirname from './utils.js';

const PORT = 8080;
const app = express();

//Middlewares a utilizar
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => 
{
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});