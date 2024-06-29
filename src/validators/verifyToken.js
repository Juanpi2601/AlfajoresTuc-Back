// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js"; 
// export const TOKEN_SECRET = process.env.TOKEN_SECRET;

// export const verifyToken = async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];

//     if (!token) return res.status(401).json({ error: "No autorizado" });

//     jwt.verify(token, TOKEN_SECRET, async (error, user) => {
//       if (error) return res.status(401).json({ error: "No autorizado" });

//       const userFound = await User.findById(user.id);
//       if (!userFound) return res.status(401).json({ error: "No autorizado" });

//       return res.json({
//         id: userFound._id,
//         name: userFound.name,
//         userName: userFound.userName,
//         email: userFound.email,
//         role: userFound.role,
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };


