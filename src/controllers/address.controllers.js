import Address from "../models/address.model.js";

export const createAddress = async (req, res) => {
  try {
    const { firstName, lastName, address: addressLine, floor, province, city, postalCode } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    
    const userId = req.user.id;
    const newAddress = new Address({
      userId,
      firstName,
      lastName,
      address: addressLine,
      floor,
      province,
      city,
      postalCode,
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params; 
    const payload = req.body; 

    const updatedAddress = await Address.findByIdAndUpdate(id, payload, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedAddress) {
      return res.status(404).json("Dirección no existente");
    }

    res.status(200).json({
      message: "Dirección actualizada con éxito",
      updatedAddress,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getAddresses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const userId = req.user.id;
    const addresses = await Address.find({ userId });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }

    if (address.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta dirección" });
    }

    await Address.findByIdAndDelete(id);

    res.status(200).json({ message: "Dirección eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};