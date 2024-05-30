import express from 'express';
import { createOrder, getAllOrders, deleteOrder, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create', createOrder);
router.get('/getAll', getAllOrders);
router.delete('/delete/:id', deleteOrder);
router.patch('/status/:id', updateOrderStatus);

export default router;
