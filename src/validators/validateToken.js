import jwt from "jsonwebtoken";
export const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const userRequired = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
  }

  try {
    const verified = jwt.verify(token, TOKEN_SECRET);
    req.user = verified; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};


export default userRequired;

