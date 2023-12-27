import productsModel from "../models/products.js";          //desarrollo un mmanager para no interactuar directamente con el modelo
import MailingService from '../../../services/MailingService.js';

export default class ProductDao
{
    getViewsProducts = async (limit, page, query = {}, sort) => 
    {
        const sortOption = {};
    
        if (sort === 'asc')
        {
            sortOption.price = 1; 
        } else if (sort === 'desc') 
        {
            sortOption.price = -1;
        }
    
        const filterProducts = await productsModel
            .find(query) 
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
    
        const totalCount = await productsModel.countDocuments(query);
    
        const totalPages = Math.ceil(totalCount / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
    
        return {
            filterProducts,
            page,
            limit,
            hasPrevPage,
            hasNextPage,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            totalPages
        };
    }
    
    getProductsPaginated = async (limit, page, query = {}, sort) => 
    {
        const options = 
        {
          page: page,
          limit: limit,
          sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : null,
        };
      
        try 
        {
          const result = await productsModel.paginate(query, options);
      
          return {
            filterProducts: result.docs,
            page: result.page,
            limit: result.limit,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            totalPages: result.totalPages,
          };
        } catch (error) {
          throw error;
        }
    };

      
    getProductsBy = (params)=>
    {
        return productsModel.findOne(params).lean(); 
    }

    addProduct = (product)=>
    {
        return productsModel.create(product);
    }

    updateProduct = (id, product)=>
    {
        return productsModel.findOneAndUpdate({ _id: id }, { $set: product }, { new: true });
    }

    getProductById = async (idProduct) => 
    {
        try 
        {
            const product = await productsModel.findOne({ '_id': idProduct });
            return product;
        } catch (error) 
        {
            throw error;
        }
    }

    getProductOwnerEmail = async (id) => {
        try {
            const product = await productsModel.findById(id);

            if (!product) {
                throw new Error(`No se encontró el producto con ID ${id}`);
            }

            return product.owner;
        } catch (error) {
            throw error;
        }
    };

    deleteProduct = async (id) => {
        try {
            const ownerEmail = await this.getProductOwnerEmail(id);
    
            const deletedProduct = await productsModel.deleteOne({ _id: id });
    
            if (deletedProduct.deletedCount === 0) {
                throw new Error(`No se encontró el producto con ID ${id}`);
            }
    
            const mailService = new MailingService();
            const mailRequest = 
            {
                from: 'e-commerce wine uruguay',
                to: ownerEmail,
                subject: 'su producto ha sido eliminado',
                html:
                `
                    <p>Usted está formalmente notificado, por este medio, de que uno de sus productos registrados ha sido eliminado de nuestra plataforma e-commerce WineUruguay.<br>Atte. equipo WineUruguay</p>
                 `
            }
            const mailResult = await mailService.sendMail(mailRequest);
    
            return { status: true }; // Puedes devolver cualquier indicador de éxito
        } catch (error) {
            throw error;
        }
    };

    

}