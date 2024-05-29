import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import User from '../models/user.model.js'; 

export const createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart) {
      return res.status(400).json({ message: 'Carrito no encontrado' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const order = new Order({
      userId,
      name: user.name,
      products: cart.products.map(item => ({
        productId: item.productId._id,
        productName: item.productId.nombre,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      totalPrice: cart.totalPrice
    });
    await order.save();

    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ message: 'Orden creada exitosamente', order });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al crear la orden' });
  }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        // Transformar los productos en cada orden
        const ordersWithTransformedProducts = orders.map(order => {
            const productsWithNames = order.products.map(item => {
                if (item.productId) {
                    return {
                        ...item.toObject(),
                        name: item.productId.nombre,
                        image: item.productId.imagenUrl
                    };
                } else {
                    console.error('Product ID is null for item:', item);
                    return {
                        ...item.toObject(),
                        name: 'Producto no encontrado',
                        image: ''
                    };
                }
            });

            return {
                ...order.toObject(),
                products: productsWithNames
            };
        });

        res.status(200).json(ordersWithTransformedProducts);
    } catch (error) {
        console.error('Error al obtener todas las órdenes:', error);
        res.status(500).json({ message: 'Ha ocurrido un error al obtener las órdenes' });
    }
};

