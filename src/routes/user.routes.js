import { Router } from 'express' 
import userControllers from '../controllers/user.controllers.js';
const {
  getAll,
  getById,
  create,
  login,
  logout,
  editById,
  deleteById,
  admin,
  verifyToken,
} = userControllers;
import  userRequired  from '../validators/validateToken.js';
import  userValidations from '../validators/userValidations.js';
import validateFields from '../validators/validateFields.js';


const router = Router();

router.get("/getAll", getAll);

router.get("/getById/:id", getById);

router.post("/login", login);

router.post("/logout", logout);

router.post("/create", [userValidations.email, userValidations.password],validateFields, create);

router.patch("/editById/:id", editById);

router.patch("/disable/:id", editById);

router.delete("/delete/:id", deleteById);

router.get("/admin", userRequired, admin);

router.get("/verifyToken", verifyToken);

export default router;