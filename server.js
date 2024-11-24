const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');

app.use(express.json());

// Datos almacenados de forma local (Trasladable a BDD externa)
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
  { nombre: 'Caso 11', descripcion: 'Descripción del caso 11', conteo: 0 },
  { nombre: 'Caso 12', descripcion: 'Descripción del caso 12', conteo: 0 },
  { nombre: 'Caso 13', descripcion: 'Descripción del caso 13', conteo: 0 },
  { nombre: 'Caso 14', descripcion: 'Descripción del caso 14', conteo: 0 },
  { nombre: 'Caso 15', descripcion: 'Descripción del caso 15', conteo: 0 },
  { nombre: 'Caso 16', descripcion: 'Descripción del caso 16', conteo: 0 },
  { nombre: 'Caso 17', descripcion: 'Descripción del caso 17', conteo: 0 },
  //{ nombre: 'Caso 18', descripcion: 'Descripción del caso 18', conteo: 0 },

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

// CRUD - Update: Se modifica el valor de "conteo" aumentandolo en 1
app.post('/api/seleccionar', (req, res) => {
  const { casoSeleccionado } = req.body;

  if (!casoSeleccionado) {
    return res.status(400).send('Caso seleccionado no proporcionado');
  }

  const caso = casos.find(c => c.nombre === casoSeleccionado);

  if (caso) {
    caso.conteo += 1;
    console.log(`El caso "${caso.nombre}" ha sido seleccionado ${caso.conteo} veces.`);
    res.status(200).send(`Selección registrada para el caso: ${caso.nombre}`);
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

  const nuevoCaso = { nombre, descripcion, conteo: 0 };

  casos.push(nuevoCaso);
  console.log(`Nuevo caso agregado: ${nombre}`);
  
  res.status(201).send('Caso agregado exitosamente');
});

//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

// Uso de archivos HTML, CSS, JS desde una carpeta llamada "public"
app.use(express.static('public'));

// Iniciar el servidor en el puerto 3000 
// Actualmente en puerto 8080 para levantar distintas versiones al mismo tiempo
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
