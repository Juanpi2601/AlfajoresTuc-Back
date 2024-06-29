import { Router } from 'express' 
import { 
        getAll,
        getById,
        create,
        login,
        logout,
        editById,
        deleteById,
        admin,
        verifyToken,
        updatePassword
} from '../controllers/user.controllers.js';
import  userRequired  from '../validators/validateToken.js';
import  userValidations from '../validators/userValidations.js';
import validateFields from '../validators/validateFields.js';


const router = Router();

router.get("/getAll", getAll);

router.get("/getById/:id", getById);

router.post("/login", login, userRequired);

router.post("/logout", logout);

router.post("/create", [userValidations.email, userValidations.password],validateFields, create);

router.patch("/editById/:id", editById);

router.patch("/disable/:id", editById);

router.delete("/delete/:id", deleteById);

router.get("/admin", userRequired, admin);

router.get("/verify-token", verifyToken);

router.patch('/update-password', userRequired, updatePassword);

export default router;