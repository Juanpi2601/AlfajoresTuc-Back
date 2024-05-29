import express from 'express';
import { createOrder, getAllOrders } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create', createOrder);
router.get('/getAll', getAllOrders);

export default router;
