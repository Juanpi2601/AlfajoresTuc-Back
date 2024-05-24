import { body } from 'express-validator';
import Novedad from '../models/novedad.model.js';
import { imageRegex, descriptionRegex } from '../helpers/productRegex.js';


const imageValidation = body('imgUrl').custom(async (value) => {
    if (!imageRegex.test(value)) {
        throw new Error('La imagen ingresada es inválida');
    }

    const imageExist = await Novedad.findOne({ imagenUrl: value });
    if (imageExist) {
        throw new Error(`La imagen ${value} ya está registrada`);
    }

    return true;
});

const nombreValidation = body('descripcion').custom(async (value) => {
    if (!descriptionRegex.test(value)) {
        throw new Error('El Nombre no puede estar vacío');
    }

    return true;
});



export const MenuValidation = {
    nombre: body("nombre")
        .notEmpty()
        .withMessage("El Nombre no puede estar vacío")
        .custom(nombreValidation),

    imgUrl: body("imagenUrl")
        .notEmpty()
        .withMessage("La URL de la imagen no puede estar vacía")
        .custom(imageValidation),

}