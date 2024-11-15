// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Datos almacenados localmente
const casos = [
  { nombre: 'Caso 1', descripcion: 'Descripción del caso 1' },
  { nombre: 'Caso 2', descripcion: 'Descripción del caso 2' },
  { nombre: 'Caso 3', descripcion: 'Descripción del caso 3' },
  { nombre: 'Caso 4', descripcion: 'Descripción del caso 4' },
  { nombre: 'Caso 5', descripcion: 'Descripción del caso 5' },
  { nombre: 'Caso 6', descripcion: 'Descripción del caso 6' },
  { nombre: 'Caso 7', descripcion: 'Descripción del caso 7' },
  { nombre: 'Caso 8', descripcion: 'Descripción del caso 8' },
  { nombre: 'Caso 9', descripcion: 'Descripción del caso 9' },
  { nombre: 'Caso 10', descripcion: 'Descripción del caso 10' },
  // Añade más casos según lo necesites
];

// Ruta para servir los datos
app.get('/api/casos', (req, res) => {
  res.json(casos);
});

// Servir archivos estáticos (HTML, CSS, JS) desde una carpeta llamada "public"
app.use(express.static('public'));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
