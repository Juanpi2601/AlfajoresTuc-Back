import User from "../models/user.model.js";
import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Address from '../models/address.model.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const TOKEN_SECRET = process.env.TOKEN_SECRET;

import { createAccessToken } from "../services/user.services.js";

export const getAll = async (req, res) => {
  try {
    const response = await User.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await User.findById(id);
    if (!response) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { name, lastName, email, dni, userName, password } = req.body;

    const userFoundEmail = await User.findOne({ email });
    if (userFoundEmail)
      return res.status(400).json({ error: ["Ya existe un usuario registrado con ese email"] });

    const userFoundDni = await User.findOne({ dni });
    if (userFoundDni)
      return res.status(400).json({ error: ["Ya existe un usuario registrado con ese DNI"] });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      lastName,
      email,
      userName,
      dni,
      password: passwordHash,
    });
    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(201).json({
      id: userSaved._id,
      name: userSaved.name,
      userName: userSaved.userName,
      dni: userSaved.dni,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      role: userSaved.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ error: ["Usuario no existente"] });
    if (userFound.disabled)
      return res.status(400).json({ error: ["La cuenta está desactivada"] });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ error: ["Usuario y/o contraseña incorrectos"] });

    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 4 * 60 * 60 * 1000,
    });
    res.status(201).json({
      id: userFound._id,
      name: userFound.name,
      userName: userFound.userName,
      email: userFound.email,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
    });
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editById = async (req, res) => {
  try {
    const { id } = req.params;
    const { disabled, ...payload } = req.body;

    if (typeof disabled !== "undefined" && disabled === true) {
      await User.findByIdAndUpdate(id, { disabled: true });
      return res.status(200).json({ message: "Usuario desactivado correctamente" });
    }

    if (typeof disabled !== "undefined" && disabled === false) {
      await User.findByIdAndUpdate(id, { disabled: false });
      return res.status(200).json({ message: "Usuario activado correctamente" });
    }

    const userUpdated = await User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!userUpdated) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario editado con éxito", userUpdated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const userExists = await User.findById(id);
    if (!userExists) return res.status(404).json({ error: "Usuario no encontrado" });

    await Order.deleteMany({ userId: id });
    await Cart.deleteMany({ userId: id });
    await Address.deleteMany({ userId: id });

    await User.findByIdAndDelete(id);
    res.status(204).json();
  } catch (error) {
    console.error('Error eliminando el usuario:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const admin = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.status(400).json({ error: "Usuario no encontrado" });
    res.json({
      id: userFound._id,
      userName: userFound.userName,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ error: "No autorizado" });
    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
      if (error) return res.status(401).json({ error: "No autorizado" });

      const userFound = await User.findById(user.id);
      if (!userFound) return res.status(401).json({ error: "No autorizado" });

      return res.json({
        id: userFound._id,
        name: userFound.name,
        userName: userFound.userName,
        email: userFound.email,
        role: userFound.role,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña actual incorrecta" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


