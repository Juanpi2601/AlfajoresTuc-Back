import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controllers.js';

const router = express.Router();

router.post('/add', addToCart);


router.get('/:userId', getCart);

router.delete('/:userId/:productId', removeFromCart);

export default router;