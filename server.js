const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');

app.use(express.json());

// Datos almacenados de forma local (Trasladable a BDD externa)
const casos = [
  { id: 1, nombre: 'Caso 1', descripcion: 'Descripción del caso 1', conteo: 0 },
  { id: 2, nombre: 'Caso 2', descripcion: 'Descripción del caso 2', conteo: 0 },
  { id: 3, nombre: 'Caso 3', descripcion: 'Descripción del caso 3', conteo: 0 },
  { id: 4, nombre: 'Caso 4', descripcion: 'Descripción del caso 4', conteo: 0 },
  { id: 5, nombre: 'Caso 5', descripcion: 'Descripción del caso 5', conteo: 0 },
  { id: 6, nombre: 'Caso 6', descripcion: 'Descripción del caso 6', conteo: 0 },
  { id: 7, nombre: 'Caso 7', descripcion: 'Descripción del caso 7', conteo: 0 },
  { id: 8, nombre: 'Caso 8', descripcion: 'Descripción del caso 8', conteo: 0 },
  { id: 9, nombre: 'Caso 9', descripcion: 'Descripción del caso 9', conteo: 0 },
  { id: 10, nombre: 'Caso 10', descripcion: 'Descripción del caso 10', conteo: 0 },
  { id: 11, nombre: 'Caso 11', descripcion: 'Descripción del caso 11', conteo: 0 },
  { id: 12, nombre: 'Caso 12', descripcion: 'Descripción del caso 12', conteo: 0 },
  { id: 13, nombre: 'Caso 13', descripcion: 'Descripción del caso 13', conteo: 0 },
  { id: 14, nombre: 'Caso 14', descripcion: 'Descripción del caso 14', conteo: 0 },
  { id: 15, nombre: 'Caso 15', descripcion: 'Descripción del caso 15', conteo: 0 },
  { id: 16, nombre: 'Caso 16', descripcion: 'Descripción del caso 16', conteo: 0 },
  { id: 17, nombre: 'Caso 17', descripcion: 'Descripción del caso 17', conteo: 0 },
];

//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

// Especificación para fijar la carga de la página de bienvenida primero
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

// CRUD - Read: Se usa para obtener los casos con Get
app.get('/api/casos', (req, res) => {
  res.json(casos);
});

//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

// CRUD - Update: Se modifica el valor de "conteo" aumentando en 1 basado en el id del caso
app.post('/api/actualizar-conteo', (req, res) => {
  const { id } = req.body; // Espera el id del caso en el cuerpo de la solicitud

  if (!id) {
    return res.status(400).send('ID del caso no proporcionado');
  }

  const caso = casos.find(c => c.id === id); // Busca el caso por su ID

  if (caso) {
    caso.conteo += 1; // Incrementa el conteo
    console.log(`El caso "${caso.nombre}" ha sido seleccionado ${caso.conteo} veces.`);
    res.status(200).json({ success: true, conteo: caso.conteo });
  } else {
    res.status(404).send('Caso no encontrado');
  }
});

//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

// CRUD - Create: recibe info de nombre y descripción, y crea un caso con esos datos y conteo de votos cero
app.post('/api/agregar-caso', (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).send('Nombre y descripción son obligatorios');
  }

  // Genera un nuevo ID basado en el último caso
  const nuevoId = casos.length > 0 ? casos[casos.length - 1].id + 1 : 1;

  const nuevoCaso = { id: nuevoId, nombre, descripcion, conteo: 0 };
  casos.push(nuevoCaso);
  console.log(`Nuevo caso agregado: ${nombre}`);
  
  res.status(201).send('Caso agregado exitosamente');
});

//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

// Uso de archivos HTML, CSS, JS desde una carpeta llamada "public"
app.use(express.static('public'));

// Iniciar el servidor en el puerto 8080 para mantener consistencia entre múltiples entornos
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
