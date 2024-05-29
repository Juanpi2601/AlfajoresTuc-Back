import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

const addToCart = async (req, res) => {
  try {
    const { userId, product: productofind , quantity } = req.body;
    
    // Busca el producto en la base de datos
    const product = await Product.findById(productofind._id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Crea un objeto de producto para agregar al carrito
    const cartProduct = {
      productId: product._id,
      quantity,
      price: product.precio,      
    };
    
    // Busca el carrito del usuario o crea uno nuevo si no existe
    let cart = await Cart.findOne({ userId });
    console.log(cartProduct);
    console.log(quantity);
    if (!cart) {
      cart = new Cart({
        userId,
        products: [cartProduct],
        totalPrice: cartProduct.price * quantity
      });
    } else {
      // Si el producto ya existe en el carrito, actualiza su cantidad y precio total
      const existingProductIndex = cart.products.findIndex(item => item.productId.equals(product._id));
      
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
        cart.totalPrice += product.precio * quantity;
      } else {
        cart.products.push(cartProduct);
        cart.totalPrice += product.precio * quantity;
      }
    }
    
    // Guarda el carrito actualizado en la base de datos
    await cart.save();
    
    res.status(201).json();
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al agregar el producto al carrito' });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate('products.productId', 'nombre precio imagenUrl');
    
    if (!cart) {
      return res.status(200).json({ message: 'Tu carrito está vacío' });
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

const removeFromCart = async (req, res) => {
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
    cart.products.splice(productIndex, 1);
    cart.totalPrice -= product.price * product.quantity;
    await cart.save();
    res.status(200).json({ message: 'Producto eliminado del carrito correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al eliminar el producto del carrito' });
  }
};

const incrementQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    const productIndex = cart.products.findIndex(item => item.productId.equals(productId));
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
    cart.products[productIndex].quantity += 1;
    cart.totalPrice += cart.products[productIndex].price;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al incrementar la cantidad del producto en el carrito:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al incrementar la cantidad del producto en el carrito' });
  }
};

const decrementQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    const productIndex = cart.products.findIndex(item => item.productId.equals(productId));
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
      cart.totalPrice -= cart.products[productIndex].price;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(400).json({ message: 'La cantidad del producto no puede ser menor a 1' });
    }
  } catch (error) {
    console.error('Error al decrementar la cantidad del producto en el carrito:', error);
    res.status(500).json({ message: 'Ha ocurrido un error al decrementar la cantidad del producto en el carrito' });
  }
};

export { addToCart, getCart, removeFromCart, incrementQuantity, decrementQuantity};