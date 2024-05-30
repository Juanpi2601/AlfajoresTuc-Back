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
      userName: user.name,
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

export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.status(200).json({ message: 'Orden eliminada exitosamente' });
  } 
  catch (error) {
      console.error('Error al eliminar la orden:', error);
      res.status(500).json({ message: 'Error al eliminar la orden' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.status(200).json({ message: 'Estado del pedido actualizado correctamente', order: updatedOrder });
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del pedido' });
  }
};
