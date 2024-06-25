import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const TOKEN = process.env.TOKEN_SECRET;

export const getAllUserService = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

export const getUserByIdService = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new Error("Error fetching user by ID: " + error.message);
  }
};

export const createUserService = async (newUser) => {
  try {
    
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    const createUser = new User(newUser);
    await createUser.save();
    return createUser;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

export const createAccessToken = async (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN,
      { expiresIn: "4h" },
      (error, token) => {
        if (error) {
          reject("Error generating access token: " + error.message);
        }
        resolve(token);
      }
    );
  });
};

export const editUserByIdService = async (id, payload, queryOptions = { new: true }) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, payload, queryOptions);
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

export const deleteUserService = async (id) => {
  try {
    await User.findByIdAndDelete(id);
    return { message: "User successfully deleted" };
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
};
