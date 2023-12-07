
import { Router } from 'express';
import { createHash, verifyPassword, tokenGenerator, verifyToken } from '../utils.js';
import passport from 'passport';
import UserModel from '../models/user.model.js';

const router = Router();

// Registro de usuario
router.post('/sessions/register', async (req, res) => {
  try {
    const { body } = req;

    // Verificar si el correo ya está registrado
    const existingUser = await UserModel.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado 😨' });
    }

    // Crear un nuevo usuario
    const hashedPassword = await createHash(body.password); // Esperar a que la Promesa se resuelva
    const newUser = await UserModel.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: hashedPassword, // Usar el valor resuelto del hash
      role: body.role || 'usuario',
    });

    // Generar token JWT para el nuevo usuario
    const token = tokenGenerator(newUser);

    // Establecer la cookie con el token
    res.cookie('access_token', token, { maxAge: 1000 * 60 * 30, httpOnly: true, signed: true });

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Inicio de sesión
router.post('/sessions/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(401).json({ message: 'Correo o contraseña inválidos 😨' });
    }

    // Buscar al usuario por correo
    const user = await UserModel.findOne({ email });
    console.log('USUARIO:', user);
    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña inválidos 😨' });
    }

    // Verificar la contraseña
    const isValidPassword = verifyPassword(password, user);
    console.log('Contraseña válida:', isValidPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Correo o contraseña inválidos 😨' });
    }

    // Generar token JWT para el usuario autenticado
    const token = tokenGenerator(user);

    // Establecer la cookie con el token
    res.cookie('access_token', token, { maxAge: 1000 * 60 * 30, httpOnly: true, signed: true });

    // Redireccionar a la página de productos después del inicio de sesión exitoso
    res.redirect('/views/products');

    // res.status(200).json({ message: 'Inicio de sesión exitoso 👽' });
  } catch (error) {
    console.error('Error interno del servidor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Cierre de sesión
router.get('/sessions/logout', async (req, res) => {
  try {
    // Destruir la sesión y eliminar la cookie
    await new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    res.clearCookie('access_token');
    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Resto del código para GitHub Auth, etc.

export default router;
