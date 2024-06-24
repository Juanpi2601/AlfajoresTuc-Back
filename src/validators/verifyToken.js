import jwt from "jsonwebtoken";
export const TOKEN = process.env.TOKEN_SECRET;

export const verifyToken = (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    const verified = jwt.verify(token, TOKEN);
    res.status(200).json(verified);
  } catch (error) {
    res.status(400).json({ message: "Token inválido" });
  }
};