import config from "../config/config.js";

export default class PersistenceFactory 
{
    static getPersistence = async()=>
    {
        let productsDao, cartsDao;

        switch(config.app.PERSISTENCE)
        {
            case 'MONGO':
            {
                productsDao = (await import('./mongo/managers/productsDao.js')).default;
                cartsDao = (await import('./mongo/managers/cartsDao.js')).default;
                break;
            }
                
            case 'FS':
            {
                productsDao = (await import('./filesystem/manager/ProductManager.js')).default;
                cartsDao = (await import('./filesystem/manager/cartsDao.js')).default;
                break;
            }  
        }
        return{
            productsDao,
            cartsDao
        }
    }
}