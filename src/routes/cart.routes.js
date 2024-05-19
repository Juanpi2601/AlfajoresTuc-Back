import express from 'express';
import { addToCart, getCart, removeFromCart, incrementQuantity, decrementQuantity } from '../controllers/cart.controllers.js';

const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', getCart);
router.delete('/:userId/:productId', removeFromCart);
router.post('/increment', incrementQuantity);
router.post('/decrement', decrementQuantity);
export default router;