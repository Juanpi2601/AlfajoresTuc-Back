import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  }, 
  email: { 
    type: String, 
    required: true 
  }, 
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      productName: { 
        type: String, 
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
    }
  ],
  shippingAddress: {
    address: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    province: { 
      type: String, 
      required: true 
    },
    postalCode: { 
      type: String, 
      required: true 
    }
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    default: 'pendiente' 
  },
  trackingNumber: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

orderSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Order.deleteMany({ userId: doc._id });
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
