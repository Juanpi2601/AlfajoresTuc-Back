import { Schema, model } from 'mongoose';
import { nameRegex, imageRegex, priceRegex, cantidadRegex, descriptionRegex } from '../helpers/productRegex.js';

const productSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "Debe ingresar un nombre"],
        minLength: [4, "El nombre es demasiado corto"],
        maxLength: [60, "El nombre es demasiado largo"],
        match: [nameRegex, "El nombre ingresado es invalido"],
        unique: [true, "Un producto con este nombre ya existe"],
    },
    categoria: {
        type: String,
        required: [true, "Debe ingresar una categoria"],
        enum: {
            values: ["Alfajores", "Conitos", "Nueces", "Cajas", "Bombones"],
            message: "{VALUE} no es una categoria valida"
        },
    },
    imagenUrl: {
        type: String,
        required: [true, "Debe ingresar una imagen"],
        match: [imageRegex, "La imagen ingresada es invalida"],
    },
    precio: {
        type: Number,
        required: [true, "Debe ingresar un precio"],
        min: [1, "{VALUE} es un valor invalido"],
        max: [10_000_000, "{VALUE} es un valor invalido"],
        match: [priceRegex, "El precio ingresado es invalido"],
    },
    cantidad: {
        type: Number,
        required: [true, "Debe ingresar una cantidad"],
        match: [cantidadRegex, "La cantidad ingresada es invalida"],
    },
    descripcion: {
        type: String,
        required: [true, "Debe ingresar una descripcion"],
        match: [descriptionRegex, "La descripcion ingresada es invalida"],
    },
    // visible: {
    //     type: Boolean,
    //     default: true,
    // },
    // isFavorite: {
    //     type: Boolean,
    //     default: false
    // }
}, {
    timestamps: true
});

export default model("Product", productSchema);