import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const addToCart = async (req, res) => {
  try {
    const { userId, product: productToFind, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'La cantidad debe ser mayor que cero' });
    }

    const product = await Product.findById(productToFind._id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (product.cantidad < quantity) {
      return res.status(400).json({ message: 'No hay suficiente cantidad disponible del producto' });
    }

    const cartProduct = {
      productId: product._id,
      quantity,
      price: product.precio,
    };

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        products: [cartProduct],
        totalPrice: cartProduct.price * quantity,
      });
    } else {
      const existingProduct = cart.products.find(item => item.productId.equals(product._id));
      if (existingProduct) {
        if (existingProduct.quantity + quantity > product.cantidad) {
          return res.status(400).json({ message: 'No se puede agregar más de la cantidad disponible en el inventario' });
        }
        existingProduct.quantity += quantity;
      } else {
        cart.products.push(cartProduct);
      }
      cart.totalPrice += product.precio * quantity;
    }

    product.cantidad -= quantity;
    await product.save();

    await cart.save();

    res.status(201).json();
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al agregar el producto al carrito' });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate('products.productId', 'nombre precio imagenUrl');
    
    if (!cart) {
      return res.status(200).json({ message: 'Tu carrito está vacío', products: [] });
    }

    const productsWithNames = cart.products.map(item => {
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

    console.log(productsWithNames);
    res.status(200).json({ ...cart.toObject(), products: productsWithNames });
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al obtener el carrito' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(item => item.productId.equals(productId));
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    const product = cart.products[productIndex];
    const dbProduct = await Product.findById(productId);

    if (!dbProduct) {
      return res.status(404).json({ message: 'Producto no encontrado en la base de datos' });
    }

    // Devolver la cantidad del producto al inventario
    dbProduct.cantidad += product.quantity;
    await dbProduct.save();

    cart.products.splice(productIndex, 1);
    cart.totalPrice -= product.price * product.quantity;
    await cart.save();

    res.status(200).json({ message: 'Producto eliminado del carrito correctamente', returnedQuantity: product.quantity });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al eliminar el producto del carrito' });
  }
};

export const incrementQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const product = cart.products.find(item => item.productId.equals(productId));

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    const dbProduct = await Product.findById(productId);

    if (!dbProduct) {
      return res.status(404).json({ message: 'Producto no encontrado en la base de datos' });
    }

    // Verificar si la cantidad total después del incremento es mayor que la cantidad en stock
    if (dbProduct.cantidad === 0) {
      return res.status(400).json({ message: 'El producto está agotado en el inventario' });
    }

    product.quantity += 1;
    cart.totalPrice += product.price;
    dbProduct.cantidad -= 1;

    await dbProduct.save();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al incrementar la cantidad del producto en el carrito:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al incrementar la cantidad del producto en el carrito' });
  }
};

export const decrementQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const product = cart.products.find(item => item.productId.equals(productId));

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    if (product.quantity > 0) {
      product.quantity -= 1;
      cart.totalPrice -= product.price;

      const dbProduct = await Product.findById(productId);

      if (!dbProduct) {
        return res.status(404).json({ message: 'Producto no encontrado en la base de datos' });
      }

      dbProduct.cantidad += 1;
      await dbProduct.save();
    } else {
      return res.status(400).json({ message: 'La cantidad del producto no puede ser menor a 1' });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al decrementar la cantidad del producto en el carrito:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al decrementar la cantidad del producto en el carrito' });
  }
};
