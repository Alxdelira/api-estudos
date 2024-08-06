import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error('A variável de ambiente SECRET não está definida');
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 401,
      message: 'Token de autenticação não fornecido.',
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      status: 401,
      message: 'Formato de token inválido. Utilize o formato: Bearer [token]',
    });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        message: 'Token inválido ou expirado.',
      });
    }

    req.usuario = decoded; 
    next();
  });
};

export default authMiddleware;
