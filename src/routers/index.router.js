// import { Router } from 'express';

// const router = Router();

// const privateRouter = (req, res, next) => {
//   if (!req.isAuthenticated() || !req.session.user) {
//     return res.redirect('/login');
//   }
//   next();
// };

// const publicRouters = (req, res, next) => {
//   if (req.session.user) {
//     return res.redirect('/views/products');
//   }
//   next();
// }

// router.get('/profile', privateRouter, (req, res) => {
//   // console.log("ESTOY ADENTRO DE PROFILE ROUTER");
//   res.render('profile', { title: 'Perfil', user: req.session.user });
// });

// router.get('/login', publicRouters, (req, res) => {
//   res.render('login', { title: 'Login' });
// });

// router.get('/register', publicRouters, (req, res) => {
//   res.render('register', { title: 'Register' });
// });


// export default router;

import { Router } from 'express';
import { createHash, verifyPassword, tokenGenerator, verifyToken } from '../utils.js';


const router = Router();

// Middleware para rutas privadas
const privateRouter = (req, res, next) => {
  // Verificar si el usuario tiene un token válido
  const token = req.signedCookies.access_token;
  if (!token) {
    return res.redirect('/login');
  }

  // Verificar el token
  verifyToken(token)
    .then((payload) => {
      // El token es válido, establecer el usuario en la solicitud
      req.user = payload;
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
  if (token) {
    // El usuario ya está autenticado, redirigir a la página de productos
    return res.redirect('/views/products');
  }
  next();
};

router.get('/profile', privateRouter, (req, res) => {
  res.render('profile', { title: 'Perfil', user: req.user });
});

router.get('/login', publicRouters, (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/register', publicRouters, (req, res) => {
  res.render('register', { title: 'Register' });
});

export default router;