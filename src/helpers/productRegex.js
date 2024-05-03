export const nameRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/u;

export const imageRegex = /^https:\/\/.*\.(jpg|jpeg|png|gif)$/;

export const priceRegex = /^(?!-)(?:\d{1,8}(?:\.\d{1,2})?|100000000)$/;

export const cantidadRegex = /^(?!-)(?:\d{1,9}|1000000000)$/;

export const descriptionRegex = /^[a-zA-Z0-9\s.,!?()\-ñÑáéíóúÁÉÍÓÚüÜ´`¨^]+$/u;