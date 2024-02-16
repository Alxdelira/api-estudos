import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();



const SECRET = process.env.SECRET || '';

const authMiddleware = (req , res , next ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const token = parts[1];

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        if (decoded) {
            req.usuario = { _id: decoded };
        }
        next();
    });
};

export default authMiddleware;