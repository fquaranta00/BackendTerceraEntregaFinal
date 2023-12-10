import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// console.log('Librería jsonwebtoken importada correctamente:', jwt);


const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const createHash = (password) => {
  return bcrypt.hash(password, bcrypt.genSaltSync(10));
};


export const verifyPassword = async (password, user) => {
  const match = await bcrypt.compare(password, user.password);
  return match;
};

export const JWT_SECRET = 'qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@';

export class Exception extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
  }
};


export const tokenGenerator = (user) => {
  const { 
    _id: id, 
    first_name, 
    last_name, 
    email,
    role,
   } = user;
  const payload = {
    id,
    first_name,
    last_name,
    email,
    role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' });
}

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, payload) => {
      if (error) { 
        return reject(error)
      }
      resolve(payload);
    });
  });
}

export const jwtAuth = (req, res, next) => {
  const token = req.signedCookies.access_token;  // Cambio aquí
  if (!token) {
    return res.status(401).json({ message: 'unauthorized' });
  }
  jwt.verify(token, JWT_SECRET, async (error, payload) => {
    if (error) {
      return res.status(403).json({ message: 'No authorized' });
    }
    req.user = await UserModel.findById(payload.id);
    next();
  });
}

export const authPolicies = (roles) => (req, res,  next) => {
  if (roles.includes('student')) {
    return next();
  }
  const { role } = req.user;
  if (!roles.includes(role)) {
    return res.status(403).json({ message: 'No tienes permiso para estar aquí 😨' });
  }
  next();
}