import express from 'express';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';
import product_mRouter from './router/products_m.router.js';
import cart_mRouter from './router/carts_m.router.js';
import __dirname from './utils.js';
import views_mRouter from './router/views_m.router.js';



const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT, ()=>console.log(`esuchando en puerto ${PORT}`));
const connection = mongoose.connect("mongodb+srv://luttringerezequiel:123@cluster0.obvrjnw.mongodb.net/ecommerce?retryWrites=true&w=majority");
//const server = http.createServer(app); // Crea el servidor HTTP


//configuracion de handlebars
const hbs = exphbs.create();
hbs.allowProtoPropertiesByDefault = true;
app.engine('handlebars', hbs.engine); // Usa hbs.engine en lugar de handlebars.engine()
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

//middlewars
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static((`${__dirname}/public`)));

//routes
app.use('/', views_mRouter);
app.use('/api/products', product_mRouter);
app.use('/api/carts', cart_mRouter);