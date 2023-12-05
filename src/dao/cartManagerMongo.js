import Cart from '../models/cart.model.js';
import { Exception } from '../utils.js';
import { v4 as uuidv4 } from 'uuid';


export default class CartManager {
  
  static async getAllCarts() {
    try {
      const cart = await Cart.find();
      // console.log('cart',JSON.stringify(cart, null, 2));
      return cart;
    } catch (error) {
      console.error('Error al obtener todos los carritos:', error);
      throw new Exception('Error al obtener todos los carritos', 500);
    }
  }

  static async getCartById(cartId) {
    try {
      const cart = await Cart.findOne({ _id: cartId }).populate('products.productId').populate('products.productDetails');
      // console.log(cart);
      return cart;
    } catch (error) {
      console.error('Error al obtener el carrito por ID:', error);
      throw new Exception('Error al obtener el carrito por ID', 500);
    }
  }
  
  static getNewId() {
    return uuidv4();
  }

  static async createCart() {
    try {
      // console.log(CartManager.getNewId());
      const newCart = await Cart.create({ products: [] });
      return newCart;
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw new Exception('Error al crear el carrito', 500);
    }
  }

  static async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findOne({ _id: cartId });

      if (!cart) {
        // Si el carrito no existe, puedes optar por crear uno nuevo o manejarlo según tus necesidades
        console.error('Carrito no encontrado.');
        // Aquí podrías lanzar una excepción o crear un nuevo carrito, dependiendo de tus requerimientos.
        return null;
      }

      // Verifica si el producto ya existe en el carrito
      const existingProduct = cart.products.find((Product) => String(Product.productId) === productId);
      console.log(existingProduct);

      if (existingProduct) {
        // Si existe, incrementa la cantidad
        existingProduct.quantity += quantity;
      } else {
        // Si no existe, agrega un nuevo producto al array
        cart.products.push({ productId, quantity });
      }

      // Guarda la actualización del carrito
      const updatedCart = await cart.save();

      console.log('Producto agregado al carrito:', updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw new Exception('Error al agregar producto al carrito', 500);
    }
  }

  static async deleteCart(cartId) {
    try {
      const deletedCart = await Cart.findByIdAndDelete(cartId);
      return deletedCart;
    } catch (error) {
      console.error('Error al eliminar el carrito:', error);
      throw new Exception('Error al eliminar el carrito', 500);
    }
  }

  static async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findOne({ _id: cartId });
      if (!cart) {
        throw new Exception('Carrito no encontrado', 404);
      }
  
      const updatedProducts = cart.products.filter(product => product.productId.toString() !== productId);
  
      cart.products = updatedProducts;
      await cart.save();
      // console.log(cart);
  
      return cart;
    } catch (error) {
      console.error('Error al remover producto del carrito:', error);
      throw new Exception('Error al remover producto del carrito', 500);
    }
  }
  

  static async updateCart(cartId, updatedProducts) {
    try {
        const cart = await Cart.findOne({ _id: cartId });
        if (!cart) {
            throw new Exception('Carrito no encontrado', 404);
        }

        // Actualizar la cantidad en el carrito o agregar el producto si no existe
        updatedProducts.forEach(updatedProduct => {
            const existingProduct = cart.products.find(product => product.productId.equals(updatedProduct.productId));

            if (existingProduct) {
                existingProduct.quantity = updatedProduct.quantity;
            } else {
                // El producto no existe en el carrito, así que lo agregamos
                cart.products.push({
                    productId: updatedProduct.productId,
                    quantity: updatedProduct.quantity
                });
            }
        });

        await cart.save();
        return cart;
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        throw new Exception('Error al actualizar el carrito', 500);
    }
}


  static async updateProductQuantity(cartId, productId, quantity) {
    try {
        const cart = await Cart.findOne({ _id: cartId });
        if (!cart) {
            throw new Exception('Carrito no encontrado', 404);
        }

        const existingProduct = cart.products.find(product => String(product.productId) === productId);

        if (existingProduct) {
            // Verificar que quantity está presente y es un número antes de actualizar
            if (quantity !== undefined && typeof quantity === 'number') {
                existingProduct.quantity = quantity;
            } else {
                throw new Exception('La cantidad debe ser un número', 400);
            }
        }

        await cart.save();
        return cart;
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        throw new Exception('Error al actualizar la cantidad del producto en el carrito', 500);
    }
}



  
  static async removeAllProductsFromCart(cartId) {
    try {
      const cart = await Cart.findOne({ _id: cartId });
      if (!cart) {
        throw new Exception('Carrito no encontrado', 404);
      }

      cart.products = []; // Eliminar todos los productos del carrito
      await cart.save();
      return cart;
    } catch (error) {
      console.error('Error al eliminar todos los productos del carrito:', error);
      throw new Exception('Error al eliminar todos los productos del carrito', 500);
    }
  }

}
