import http from 'http';

import app from './app.js';
import { init as initMongoDB } from './db/mongodb.js'; // Cambia el nombre de la función a initMongoDB
// Inicializa la conexión con MongoDB
await initMongoDB();
// Inicializa el servidor HTTP
const server = http.createServer(app);
const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}/`);
});

