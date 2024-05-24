import express from "express";
import {
    createNovedad,
    getAllNovedad,
    getNovedadById,
    deleteNovedadById,
} from "../controllers/novedad.controllers.js";

const router = express.Router();

router.post("/create", createNovedad);
router.get("/getAll", getAllNovedad);
router.get("/getById/:id", getNovedadById);
router.delete("/delete/:id", deleteNovedadById);

export default router;