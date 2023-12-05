import ProductModel from '../models/product.model.js';
import { Exception } from '../utils.js';

export default class ProductManager {
  
  static get(query = {}) {
    const criteria = {};
    if (query.category) {
      criteria.category = query.category;
    }
    return ProductModel.find(criteria);
  }

  static async getById(pid) {
    const product = await ProductModel.findById(pid);
    if (!product) {
      throw new Exception('Producto no encontrado 😨', 404);
    }
    return product;
  }

  static async create(data) {
    const product = await ProductModel.create(data);
    console.log('Producto creado correctamente 😁');
    return product;
  }

  static async updateById(pid, data) {
    const product = await ProductModel.findById(pid);
    if (!product) {
      throw new Exception('Producto no encontrado 😨', 404);
    }
    // const criteria = { _id: pid };
    const operation = { $set: data };
    await ProductModel.updateOne(operation);
    console.log('Producto actualizado correctamente 😁');
  }

  static async deleteById(pid) {
    const product = await ProductModel.findById(pid);
    if (!product) {
      throw new Exception('Producto no encontrado 😨', 404);
    }
    const criteria = { _id: pid };
    await ProductModel.deleteOne(criteria);
    console.log('Producto eliminado correctamente 😑');
  }


  static async aggregate(pipeline) {
    const result = await ProductModel.aggregate(pipeline);
    return result;
  }

  static async paginate(matchCriteria, options) {
    try {
      const products = await ProductModel.paginate(matchCriteria, options);
      return products;
    } catch (error) {
      console.error('Error al paginar productos:', error);
      throw new Exception('Error al paginar productos', 500);
    }
  }
  
}
