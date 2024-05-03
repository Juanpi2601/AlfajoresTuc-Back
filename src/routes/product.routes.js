import { Router } from "express";
import {
    createProduct,
    getAll,
    getById,
    deleteById,
    getProductsWithOptions,
    editById,
    toggleFavorite
} from "../controllers/product.controllers.js";
import validateFields from "../validators/validateFields.js";

const router = Router();

router.post("/create", createProduct);
router.get("/getAll", getAll);
router.get("/getById/:id", getById);
router.get("/productsWithOptions/search", getProductsWithOptions);
router.delete("/delete/:id", deleteById);
router.patch("/edit/:id", validateFields, editById);
router.patch("/visible/:id", validateFields, editById);
router.patch('/favorite/:id', toggleFavorite);

export default router;