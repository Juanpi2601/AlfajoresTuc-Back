import { Schema, model } from 'mongoose';
import { imageRegex, nameRegex } from '../helpers/productRegex.js';

const novedadSchema = new Schema({
   
    nombre: {
        type: String,
        required: [true, "Debe ingresar un nombre"],
        minLength: [4, "El nombre es demasiado corto"],
        maxLength: [60, "El nombre es demasiado largo"],
        match: [nameRegex, "El nombre ingresado es invalido"],
        unique: [true, "Un producto con este nombre ya existe"],
    },
    imgUrl: {
        type: String,
        required: [true, "Debe ingresar una imagen"],
        match: [imageRegex, "La imagen ingresada es invalida"],
    },
    visible: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

export default model("Novedad", novedadSchema);