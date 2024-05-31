import express from 'express';
import { 
    addToCart, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    getCart,
    confirmarPedido
} from '../controllers/cart.controllers.js';

const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', getCart);
router.delete('/:userId/:productId', removeFromCart);
router.post('/increment/:userId/:productId', incrementQuantity);
router.post('/decrement/:userId/:productId', decrementQuantity);
router.post('/confirmarPedido', confirmarPedido);

export default router;