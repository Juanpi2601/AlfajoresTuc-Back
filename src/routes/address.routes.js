import { Router } from 'express'
import {
    createAddress,
    updateAddress,
    getAddresses,
    deleteAddress
} from '../controllers/address.controllers.js'
import  userRequired  from '../validators/validateToken.js';

const router = Router();

router.post('/addresses', userRequired, createAddress);
router.patch('/updateAddress/:id', userRequired, updateAddress);
router.get('/getAddresses', userRequired, getAddresses);
router.delete("/deleteAddress/:id", userRequired, deleteAddress);


export default router;