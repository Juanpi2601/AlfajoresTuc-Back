import jwt from 'jsonwebtoken';
const TOKEN_SECRET = process.env.TOKEN_SECRET;


const userRequired = (req, res, next) => {
  const { token } = req.cookies
  if(!token) return res.status(401).json('Acceso no autorizado.');

  jwt.verify(token, TOKEN_SECRET, (error, user) => {
    if(error) return res.status(403).json('Invalid token');
    req.user = user
    
    next();
  })
};

export default userRequired;
