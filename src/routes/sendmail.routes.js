import { Router } from 'express';
import { sendMail } from '../controllers/sendmail.controller.js';

const router = Router();

router.post("/", sendMail);

export default router;