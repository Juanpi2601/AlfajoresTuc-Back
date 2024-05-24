import Novedad from "../models/novedad.model.js";

export const createNovedad = async (req, res) => {
    const { nombre, imgUrl } = req.body;

    try {
        const newNovedad = await Novedad.create({
            nombre: nombre,
            imgUrl: imgUrl,
        });

        res.status(201).json(newNovedad);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });

    }
}


export const getAllNovedad = async (req, res) => {
    try {
        const novedades = await Novedad.find();
        res.status(200).json(novedades);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getNovedadById = async (req, res) => {
    const { id } = req.params;
    try {
        const novedad = await Novedad.findById(id);
        res.status(200).json(novedad);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteNovedadById = async (req, res) => {
    const { id } = req.params;

    try {
        await Novedad.findByIdAndDelete(id);
        res.status(204).json({ message: "Novedad eliminada exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateNovedadVisibility = async (req, res) => {
    const { id } = req.params;
    const { visible } = req.body;

    try {
        const novedad = await Novedad.findByIdAndUpdate(id, { visible }, { new: true });

        if (!novedad) {
            return res.status(404).json({ message: 'Novedad no encontrada' });
        }

        res.status(200).json(novedad);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

