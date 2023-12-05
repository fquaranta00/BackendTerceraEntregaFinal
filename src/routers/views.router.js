import { Router } from 'express';
import ProductManager from '../dao/ProductManagerMongo.js'; 
import CartManager from '../dao/cartManagerMongo.js'; 


const router = Router();


router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query, available } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
      customLabels: {
        docs: 'payload',
        totalDocs: 'totalProducts',
        totalPages: 'totalPages',
        page: 'page',
        nextPage: 'nextPage',
        prevPage: 'prevPage',
        hasNextPage: 'hasNextPage',
        hasPrevPage: 'hasPrevPage',
        prevLink: 'prevLink',
        nextLink: 'nextLink'
      }
    };

    const matchCriteria = {};
    if (query) {
      matchCriteria.category = query;
    }
    if (available) {
      matchCriteria.status = available === 'true' ? true : false;
    }

    // const welcomeMessage = req.session.welcomeMessage || 'Bienvenido';

    const products = await ProductManager.paginate(matchCriteria, options);

    const buildResponse = (data) => {
        return {
            status: 'success',
            payload: data.payload.map(product => product.toJSON()),
            totalProducts: data.totalProducts,
            limit: data.limit,
            totalPages: data.totalPages,
            page: data.page,
            pagingCounter: data.pagingCounter,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.hasPrevPage ? `http://localhost:8080/views/products?limit=${data.limit}&page=${data.prevPage}` : '',
            nextLink: data.hasNextPage ? `http://localhost:8080/views/products?limit=${data.limit}&page=${data.nextPage}` : '',
        };
    };

    // console.log(products);

    // res.render('products', { ...buildResponse(products), welcomeMessage });

    res.render('products', { ...buildResponse(products) });


    // res.render('products', buildResponse(products));



  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});


router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductManager.getById(pid);
    res.render('productDetails', { product: product.toJSON() });
    // res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Ruta para obtener detalles de un carrito por ID
router.get('/carts/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;

    // Aquí deberías tener tu lógica para obtener los detalles del carrito por ID
    // Supongamos que tienes una función en tu gestor de carritos para obtener el carrito por ID
    const cart = await CartManager.getCartById(cartId);
    
    if (!cart) {
      console.log(`El carrito con ID ${cartId} no fue encontrado.`);
      // Puedes redirigir a una página de error o manejar de otra manera.
      return res.status(404).render('error', { message: 'Carrito no encontrado' });
    }
    // console.log(cart);

    // Renderizar la vista 'carts'
    res.render('cart', { cart: cart.toJSON() });

  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});


export default router;
