import { Router } from "express";
import CartManager from "../../dao/cartManagerMongo.js";
// import ProductManager from "../dao/productManager.js";

const cartsRouter = Router();

// Endpoint para obtener todos los carritos
cartsRouter.get('/carts', async (req, res) => {
    try {
        const carts = await CartManager.getAllCarts();
        // console.log(carts); 
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para obtener un carrito por ID
cartsRouter.get('/carts/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await CartManager.getCartById(cartId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para crear un nuevo carrito
cartsRouter.post('/carts', async (req, res) => {
    try {
        const newCart = await CartManager.createCart();
        res.status(200).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para agregar un producto a un carrito
cartsRouter.post('/carts/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const quantity = 1; // Siempre incrementamos la cantidad en 1

        await CartManager.addProductToCart(cartId, productId, quantity);

        res.status(200).json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para eliminar un carrito por ID
cartsRouter.delete('/carts/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        await CartManager.deleteCart(cartId);
        res.status(200).json({ message: 'Carrito eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para eliminar un producto del carrito
cartsRouter.delete('/carts/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        await CartManager.removeProductFromCart(cartId, productId);

        res.status(200).json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para actualizar la cantidad de un producto en el carrito
cartsRouter.put('/carts/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        await CartManager.updateProductQuantity(cartId, productId, quantity);

        res.status(200).json({ message: 'Cantidad de producto actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para eliminar todos los productos del carrito
cartsRouter.delete('/carts/:cartId/products', async (req, res) => {
    try {
        const { cartId } = req.params;

        await CartManager.removeAllProductsFromCart(cartId);

        res.status(200).json({ message: 'Todos los productos eliminados del carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para actualizar todos los productos en el carrito
cartsRouter.put('/carts/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const { products } = req.body;

        await CartManager.updateCart(cartId, products);

        res.status(200).json({ message: 'Productos del carrito actualizados correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para visualizar un carrito específico
cartsRouter.get('/carts/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await CartManager.getCartById(cid);
  
      res.render('cart', { products: cart.products }); // Renderizar la vista 'cart'
  
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });


export default cartsRouter;
