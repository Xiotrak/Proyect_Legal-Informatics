document.addEventListener('DOMContentLoaded', () => {

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
  
  //Chequeo de la página actual en la que nos encontramos
  //Se activa la correspondiente función para el html abierto
  const currentPage = window.location.pathname;

  if (currentPage.includes('index.html') || currentPage === '/') {
    // Lógica de la página principal (index.html)
    inicializarPaginaPrincipal();
  } else if (currentPage.includes('todos-los-casos.html')) {
    // Lógica de la página para mostrar todos los Casos
    inicializarTodosLosCasos();
  }

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

  //Función que se ejecuta para index.html
  function inicializarPaginaPrincipal() {
    let casos = [];
    let currentIndex = 0;
    let randomIndices = [];

    //Sección para sacar la info del servidor, generar
    // nuevos indices y mostrar el primer par de casos
    fetch('/api/casos')
      .then(response => response.json())
      .then(data => {
        casos = data;
        generarIndicesAleatorios();
        mostrarCasos();
      })
    .catch(error => console.error('Error al cargar los casos:', error));
    
    //---------------------------------------------------------------------------------------------------------------------------------
    
    //Función generarIndicesAleatorios():
    //Se genera una lista de índices aleatorios para ordenar en pares
    //Se usa el largo del listado de casos como techo para el num random
    //Se extraen las secciones del listado original de a pares
    function generarIndicesAleatorios() {
      const numCasos = casos.length;
      const indices = Array.from({ length: numCasos }, (_, i) => i);

      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      for (let i = 0; i < indices.length; i += 2) {
        randomIndices.push(indices.slice(i, i + 2));
      }
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    
    //Función mostrarCasos():
    //Se utiliza para mostrar los casos de a pares, siempre y cuando el indice no sea mayor a la cantidad de casos
    //Se limpia la información del contenedor y se verifica no estar en caso límite
    //El par actual de casos (en base al indice) se añade al container mostrando su nombre y descripción
    //Si ya no hay más pares de casos, oculta botones de selección y muestra boton para cambiar de html
    function mostrarCasos() {
      const container = document.getElementById('casos-container');
      const botonesSeleccion = document.getElementById('botones-seleccion');
      const botonVerTodo = document.getElementById('show-all-btn');

      container.innerHTML = '';

      if (currentIndex >= randomIndices.length) {
        botonesSeleccion.style.display = 'none';
        botonVerTodo.style.display = 'block';
        return;
      }

      const parActual = randomIndices[currentIndex];
      parActual.forEach(index => {
        if (index < casos.length) {
          const caso = casos[index];
          const casoDiv = document.createElement('div');
          casoDiv.classList.add('caso');
          casoDiv.innerHTML = `<h2>${caso.nombre}</h2><p>${caso.descripcion}</p>`;
          container.appendChild(casoDiv);
        }
      });
    }
    //---------------------------------------------------------------------------------------------------------------------------------
    //Función registrarSeleccion(opción):
    //Se registra la selección del usuario dependiendo de la posición en el par de casos (par_casos[posición]) 
    //Se identifica el par de casos usando el indice, se hace un chequeo en caso de terminar de ver todos los casos
    //Se guarda registro de la opción a través de la consola, si no hubo error el indice aumenta y se continua con otro par
    function registrarSeleccion(opcion) {
      if (currentIndex >= randomIndices.length) {
        console.log('Ya no se pueden realizar más selecciones.');
        return;
      }

      const parActual = randomIndices[currentIndex];
      const casoSeleccionado = casos[parActual[opcion]].nombre;

      fetch('/api/seleccionar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ casoSeleccionado })
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al registrar la selección');
          console.log('Selección registrada:', casoSeleccionado);

          currentIndex++;
          mostrarCasos();
          
        })
        .catch(error => console.error('Error:', error));
    }

    
    //---------------------------------------------------------------------------------------------------------------------------------
    // Eventos para ejecutar función de registro al presionar un botón o para cambiar de html
    document.getElementById('opcion-1-btn').addEventListener('click', () => registrarSeleccion(0));
    document.getElementById('opcion-2-btn').addEventListener('click', () => registrarSeleccion(1));

    document.getElementById('show-all-btn').addEventListener('click', () => {
      window.location.href = 'todos-los-casos.html';
    });
  }

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

  //Función que se ejecuta para todos-los-casos.html
  function inicializarTodosLosCasos() {
    const container = document.getElementById('todos-casos-container');

    // Se obtienen todos los casos y se ordenan en cierto formato html
    fetch('/api/casos')
      .then(response => response.json())
      .then(data => {
        data.forEach(caso => {
          const casoDiv = document.createElement('div');
          casoDiv.classList.add('caso');
          casoDiv.innerHTML = `<h2>${caso.nombre}</h2>
                              <p>${caso.descripcion}</p>
                              <p><strong>Veces seleccionado:</strong> ${caso.conteo}</p>`;
          container.appendChild(casoDiv);
        });
      })
      .catch(error => console.error('Error al cargar los casos:', error));
    document.getElementById('volver-btn').addEventListener('click', () => {
      //Reinicia el proceso volviendo a la página principal, el chequeo inicial
      //invoca la función que reinicia el proceso sin perder el conteo de elecciones
      window.location.href = 'index.html';
    });
  }
});
