import express from 'express';
import exphbs from 'express-handlebars';
import viewsRouter from './router/views.router.js';
import productRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js'
import __dirname from './utils.js';
import http from 'http';
import { Server } from 'socket.io';

import ProductManager from "./manager/ProductManager.js";
const managers = new ProductManager('products.json');

const PORT = 8080;
const app = express();
const server = http.createServer(app); // Crea el servidor HTTP

//configuracion de handlebars
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine); // Usa hbs.engine en lugar de handlebars.engine()
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

// instancia de Socket.IO vinculada al servidor HTTP
const io = new Server(server); // Utiliza la clase Server

//Middlewares a utilizar
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static((`${__dirname}/views`)));

//Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/views', viewsRouter);

app.listen(PORT, () => 
{
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

// conexiones de Socket.IO
io.on('connection', async (socket) => 
{
  console.log('Usuario conectado:', socket.id);

  const productos = await managers.getProducts();
  socket.emit('productAdded', productos);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});