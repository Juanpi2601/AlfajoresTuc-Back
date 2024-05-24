import { Router } from 'express';
import { sendMail, forgotPasswordController } from '../controllers/sendmail.controller.js';

const router = Router();

router.post("/", sendMail);
router.post("/forgot-password", forgotPasswordController);

export default router;