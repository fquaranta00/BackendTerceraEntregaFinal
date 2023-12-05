import mongoose from 'mongoose';

const productQuantitySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  productDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
}, { _id: false });

const productOrderSchema = new mongoose.Schema({
  // id: { type: String, required: true },
  products: [productQuantitySchema],
}, { timestamps: true });


productOrderSchema.pre('find', function () {
  this.populate('products.productId');
});


export default mongoose.model('Cart', productOrderSchema);
