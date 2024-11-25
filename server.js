const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');

app.use(express.json());

// Datos almacenados de forma local (Trasladable a BDD externa)
const casos = [
  { id: 1, nombre: 'Aborto Consentido', descripcion: 'Situación en la que una persona realiza un aborto a una mujer, y esta da su consentimiento en el realizamiento del tratamiento.', conteo: 0 },
  { id: 2, nombre: 'Aborto por Accidente', descripcion: 'Situación en la que una persona realiza un aborto a una mujer de manera accidental mientras se realizan acciones violentas hacia esta. La mujer claramente mostraba indicios de embarazo.', conteo: 0 },
  { id: 3, nombre: 'Aborto por la embarazada', descripcion: 'Situación en la que la mujer embarazada causa su aborto, o autoriza a que otra persona se lo cause.', conteo: 0 },
  { id: 4, nombre: 'Suposición de parto y sustitución', descripcion: 'Situación en la cual una persona finge la existencia del nacimiento de un niño vivo, presentando a un niño ajeno como propio.', conteo: 0 },
  { id: 5, nombre: 'Violación a persona mayor de 14 años', descripcion: 'Situación en la que una persona accede carnalmente, por vía vaginal, anal o bucal, a una persona mayor de 14 años. Esta acción se realizó haciendo uso de fuerza hacia la víctima.', conteo: 0 },
  { id: 6, nombre: 'Violación a persona menor de 14 años', descripcion: 'Situación en la que una persona accede carnalmente, por vía vaginal, anal o bucal, a una persona menor de 14 años. Esta acción se realizó haciendo uso de fuerza hacia la víctima.', conteo: 0 },
  { id: 7, nombre: 'Violación a menor de edad mayor de 14 años', descripcion: 'Situación en la que una persona abusa de una relación de dependencia con la victima. En este caso, el menor de edad tenia 16 años y el victimario cumplia el rol de cuidador del menor.', conteo: 0 },
  { id: 8, nombre: 'Violación con Asesinato', descripcion: 'Situación en la que en una violación, además se comete homicidio a la víctima.', conteo: 0 },
  { id: 9, nombre: 'Parricidio', descripcion: 'Situación en la que una persona, conociendo la relación de linaje que lo vincula a otra, ocasione su asesinato. En este caso, un hijo (mayor de edad) asesina a su padre. (el cuál todavia no era adulto mayor)', conteo: 0 },
  { id: 10, nombre: 'Femicidio a No Conviviente', descripcion: 'Situación en la que un hombre mata a una mujer con la cual ha tenido una relación de pareja. En este caso, el hombre y la mujer estuvieron en una relación de pareja de carácter sentimental, pero nunca llegaron a vivir juntos.', conteo: 0 },
  { id: 11, nombre: 'Femicidio a Conviviente', descripcion: 'Situación en la que un hombre mata a una mujer con la cual tiene una relación de pareja. En este caso, el hombre y la mujer estaban en una relación de pareja de carácter sentimental, viviendo juntos.', conteo: 0 },
  { id: 12, nombre: 'Maltrato a menores', descripcion: 'Situación en la cual una persona maltrate a un niño, niña o adolescente menor de 18 años físicamente, de manera relevante.', conteo: 0 },
  { id: 13, nombre: 'Maltrato a mayores de edad', descripcion: 'Situación en la cual una persona maltrate físicamente a una persona adulta mayor, de manera relevante. En este caso, el victimario tenia rol de protector del mayor de edad y no impedia que se le hiciera maltrato.', conteo: 0 },
  { id: 14, nombre: 'Tráfico de Migrantes', descripcion: 'Situación en la cual con ánimo de lucro se promueva la entrada ilegal al país de una persona que no sea nacional o residente en Chile.', conteo: 0 },
  { id: 15, nombre: 'Robo con Violencia', descripcion: 'Situación en la cual una persona asalta a otra con motivo u ocasión de robo. En este caso, el victimario despúes de aplicar violencia e intimidación, al ver que la victima se resistia al robo, acabó matándolo con el fin de cumplir su cometido.', conteo: 0 },
  { id: 16, nombre: 'Robo por Sorpresa', descripcion: 'Situación en la cual una persona se apropia de dinero u otros bienes que las victimas llevaban consigo. En este caso, el victimario aprovecho un aglomeramiento de personas para robar por sorpresa, sin uso de violencia o intimidación.', conteo: 0 },
  { id: 17, nombre: 'Actos de Piratería', descripcion: 'Situación en la cual se realiza plagio de artículos o diseños, violaciones a la propiedad intelectual, robo de patentes, falsificaciones o adulteraciones a la versión original. ', conteo: 0 },
  { id: 18, nombre: 'Robo en lugar habitado', descripcion: 'Situación en la que se realiza un robo con fuerza en las cosas, efectuado en un lugar habitado o destinado a la habitación. En este caso, se hizo uso de llaves reales que fueron sustraídas previamente, para entrar en el lugar del robo', conteo: 0 },
  { id: 19, nombre: 'Robo en lugar no habitado', descripcion: 'Situación en la que se realiza un robo en un lugar no habitado. En este caso, se hizo fractura de ventanas para acceder al lugar del robo.', conteo: 0 },
  //{ id: 20, nombre: 'Caso 20', descripcion: 'Descripción del caso 20', conteo: 0 },
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

// CRUD - Update: Editar el nombre y la descripción de un caso
app.put('/api/editar-caso/:id', (req, res) => {
  const casoId = parseInt(req.params.id);
  const { nombre, descripcion } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).send('Nombre y descripción son obligatorios');
  }

  const caso = casos.find(c => c.id === casoId);

  if (caso) {
    caso.nombre = nombre;
    caso.descripcion = descripcion;
    console.log(`El caso "${caso.nombre}" ha sido actualizado.`);
    res.status(200).send('Caso actualizado exitosamente');
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

// CRUD - Delete: sección usada para eliminar un caso
app.delete('/api/casos/:id', (req, res) => {
  const casoId = parseInt(req.params.id);
  console.log(`ID recibido para eliminar: ${casoId}`); // Diagnóstico
  const index = casos.findIndex(caso => caso.id === casoId);

  if (index !== -1) {
    casos.splice(index, 1);
    res.status(200).send({ message: 'Caso eliminado exitosamente' });
  } else {
    res.status(404).send({ message: 'Caso no encontrado' });
  }
});


//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

// Uso de archivos HTML, CSS, JS desde una carpeta llamada "public"
app.use(express.static('public'));

// Iniciar el servidor en el puerto 8080 para mantener consistencia entre múltiples entornos
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
