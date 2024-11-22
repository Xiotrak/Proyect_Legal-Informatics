const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para procesar JSON en el cuerpo de la solicitud
app.use(express.json());

// Datos almacenados de forma local (cambiar a bdd externa)
const casos = [
  { nombre: 'Caso 1', descripcion: 'Descripción del caso 1', conteo: 0 },
  { nombre: 'Caso 2', descripcion: 'Descripción del caso 2', conteo: 0 },
  { nombre: 'Caso 3', descripcion: 'Descripción del caso 3', conteo: 0 },
  { nombre: 'Caso 4', descripcion: 'Descripción del caso 4', conteo: 0 },
  { nombre: 'Caso 5', descripcion: 'Descripción del caso 5', conteo: 0 },
  { nombre: 'Caso 6', descripcion: 'Descripción del caso 6', conteo: 0 },
  { nombre: 'Caso 7', descripcion: 'Descripción del caso 7', conteo: 0 },
  { nombre: 'Caso 8', descripcion: 'Descripción del caso 8', conteo: 0 },
  { nombre: 'Caso 9', descripcion: 'Descripción del caso 9', conteo: 0 },
  { nombre: 'Caso 10', descripcion: 'Descripción del caso 10', conteo: 0 },
];

// Ruta para servir los datos
app.get('/api/casos', (req, res) => {
  res.json(casos);
});

// Ruta para registrar la selección
app.post('/api/seleccionar', (req, res) => {
  const { casoSeleccionado } = req.body;

  if (!casoSeleccionado) {
    return res.status(400).send('Caso seleccionado no proporcionado');
  }

  // Busca el caso correspondiente y actualiza el conteo
  const caso = casos.find(c => c.nombre === casoSeleccionado);

  if (caso) {
    caso.conteo += 1;
    console.log(`El caso "${caso.nombre}" ha sido seleccionado ${caso.conteo} veces.`);
    res.status(200).send(`Selección registrada para el caso: ${caso.nombre}`);
  } else {
    res.status(404).send('Caso no encontrado');
  }
});

// Uso de archivos HTML, CSS, JS desde una carpeta llamada "public"
app.use(express.static('public'));

// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
