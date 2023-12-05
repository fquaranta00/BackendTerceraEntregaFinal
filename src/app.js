// import express from "express";
// import passport from 'passport';
// import expressSession from 'express-session';
// import handlebars from 'express-handlebars';
// import path from 'path';
// import MongoStore from 'connect-mongo';

// import { URI } from '../src/db/mongodb.js';
// import indexRouter from './routers/index.router.js';
// import sessionsRouter from './routers/sessions.router.js';
// import { init as initPassportConfig } from './config/passport.config.js';
// import { __dirname } from './utils.js';
// import productsRouterMD from "../src/routers/api/products.router.js";
// import cartsRouterMD from "../src/routers/api/carts.router.js";
// import Views from "../src/routers/views.router.js"



// const app = express();

// const SESSION_SECRET = 'qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@';

// app.use(expressSession({
//   secret: SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: URI,
//     mongoOptions: {},
//     ttl: 120,
//   }), 
// }));


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '../public')));

// // Configuración Handlebars
// app.engine('handlebars', handlebars.engine());
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'handlebars');

// initPassportConfig();

// app.use(passport.initialize());
// app.use(passport.session());


// app.use('/', indexRouter);

// // app.use('/api', productsRouter, cartsRouter);
// app.use('/api', sessionsRouter, productsRouterMD, cartsRouterMD);
// // app.use('/chat', chatRouter);
// app.use('/views', Views);



// app.use((error, req, res, next) => {
//     const message = `😨 Ah ocurrido un error desconocido: ${error.message}`;
//     console.error(message);
//     res.status(500).json({ status: 'error', message });
// });

// export default app;





import express from 'express';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';

import sessionsRouter from './routers/sessions.router.js';
import productsRouterMD from "../src/routers/api/products.router.js";
import cartsRouterMD from "../src/routers/api/carts.router.js";
import Views from "../src/routers/views.router.js"

import indexRouter from './routers/index.router.js';
import { init as initPassoport } from './config/passport.config.js';
import { __dirname } from './utils.js';

const app = express();

const COOKIE_SECRET = 'qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@';

app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// // Configuración Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


initPassoport();
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api', sessionsRouter, productsRouterMD, cartsRouterMD);
app.use('/views', Views);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido 😨: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});

export default app;
