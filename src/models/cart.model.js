import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product', 
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

cartSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Cart.deleteMany({ userId: doc._id });
  }
});

export default model('Cart', cartSchema);
