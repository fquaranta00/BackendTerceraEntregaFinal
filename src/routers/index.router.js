
import { Router } from 'express';
import { createHash, verifyPassword, tokenGenerator, verifyToken, jwtAuth } from '../utils.js';


const router = Router();

// Middleware para rutas privadas
const privateRouter = (req, res, next) => {
  // Verificar si el usuario tiene un token válido
  const token = req.signedCookies.access_token;
  // console.log('El TOKEN en privateRouter es:', token);
  if (!token) {
    return res.redirect('/login');
  }

  // Verificar el token
  verifyToken(token)
    .then((payload) => {
      // El token es válido, establecer el usuario en la solicitud
      req.user = payload;
      // console.log('HolaaaaAAAAAA:',req.user);
      next();
    })
    .catch((error) => {
      // El token no es válido, redirigir a la página de inicio de sesión
      res.redirect('/login');
    });
};

const publicRouters = (req, res, next) => {
  // Verificar si el usuario tiene un token válido
  const token = req.signedCookies.access_token;
  // console.log('El TOKEN en publicRouter es:', token);
  

  if (token) {
    // El usuario ya está autenticado, redirigir a la página de productos
    return res.redirect('/profile');
  }

  // Si no hay token, continúa con el siguiente middleware
  next();
};


router.get('/profile', privateRouter, (req, res) => {
  // Obtén el token de las cookies
  const token = req.signedCookies.access_token;
  console.log('EL TOTOTOKEN ES:', token);
  // Verifica si hay un token
  if (!token) {
    return res.redirect('/login');
  }

  // Decodifica el token para obtener los datos del usuario
  verifyToken(token)
    .then((user) => {
      // Pasa los datos del usuario a la vista
      res.render('profile', { title: 'Perfil', user });
    })
    .catch((error) => {
      console.error('Error al decodificar el token:', error);
      if (error.name === 'TokenExpiredError') {
        console.log('El token ha expirado.');
      } else {
        console.log('Otro error al decodificar el token:', error);
      }
      res.redirect('/login');
    });
});


router.get('/login', publicRouters, (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/register', publicRouters, (req, res) => {
  res.render('register', { title: 'Register' });
});

router.get('/current', jwtAuth, (req, res) => {
  const token = req.cookies.access_token;
  // console.log('Token from cookie:', token);
  res.status(200).json(req.user);
});

export default router;