import Product from "../models/product.model.js"

export const createProduct = async (req, res) => {
    const { nombre, imagenUrl, precio, cantidad, descripcion, categoria } = req.body;

    try {
        const newProduct = await Product.create({
            nombre: nombre,
            imagenUrl: imagenUrl,
            precio: precio,
            descripcion: descripcion,
            cantidad: cantidad,
            categoria: categoria
        });

        res.status(201).json({ _id: newProduct._id });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });

    }
}


export const getAll = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);

    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

export const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const products = await Product.findById(id);
        res.status(200).json(products);

    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

export const deleteById = async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.status(204).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

export const editById = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
        const productUpdate = await Product.findByIdAndUpdate(id, payload, { visible: false });

        if (!productUpdate) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto actualizado" });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

export const getProductsWithOptions = async (req, res) => {
    const { nombre, precio, categoria, descripcion, cantidad } = req.query;
    const searchQuery = { visible: true };
    let sortQuery = {};

    if (precio === 'asc' || precio === 'desc') {
        sortQuery.precio = precio === 'asc' ? 1 : -1;
    }

    if (nombre) {
        const partialMatchnombre = new RegExp(nombre, 'i');
        searchQuery.nombre = partialMatchnombre;
    }

    if (precio === 'disc') {
        searchQuery.discountPercentage = { $exists: true };
    }

    if (categoria) {
        searchQuery.categoria = categoria;
    }
    if (descripcion){
        searchQuery.descripcion = descripcion;
    }
    if(cantidad){
        searchQuery.cantidad = cantidad;
    }

    try {
        const productsFound = await Product.find(searchQuery).sort(sortQuery);

        if (productsFound.length >= 1) {
            return res.status(200).json(productsFound);
        }

        res.status(404).json({ message: 'Producto no encontrado' });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

export const toggleFavorite = async (req, res) => {
    const { id } = req.params;
    const { isFavorite } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        product.isFavorite = isFavorite;
        await product.save();

        res.status(200).json({ message: 'Estado de favorito del producto actualizado' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};