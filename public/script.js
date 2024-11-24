document.addEventListener('DOMContentLoaded', () => {
  let casos = []; // Lista de casos obtenidos del backend
  let paresAleatorios = []; // Lista de pares de índices aleatorios
  let indiceActual = parseInt(sessionStorage.getItem('indiceActual')) || 0; // Restaurar o inicializar a 0
  let votosMock = {}; // Datos simulados para votos totales
  let metricasMock = {}; // Métricas simuladas para cada par

  // Obtener los casos del backend
  fetch('/api/casos')
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      casos = datos;
      inicializarMetricasMock();
      inicializarVotosMock();
      generarParesAleatorios();
      mostrarCasos();
    })
    .catch((error) => console.error('Error al obtener los casos:', error));


  // Generar una clave única para cada par de casos
  function generarClave(a, b) {
    return a < b ? `${a}-${b}` : `${b}-${a}`; // Always return the key as min-max
  }
    
  // Inicializar métricas simuladas
  function inicializarMetricasMock() {
    metricasMock = {}; // Ensure it's empty before initializing
  
    for (let i = 0; i < casos.length; i++) {
      for (let j = i + 1; j < casos.length; j++) {
        const key = generarClave(i, j);
  
        // Generate one random percentage
        const porcentajeA = Math.floor(Math.random() * 101); // Random value between 0-100
        const porcentajeB = 100 - porcentajeA; // Complement to 100%
  
        // Assign to the metrics
        metricasMock[key] = {
          porcentajeA,
          porcentajeB,
        };
      }
    }
  
    console.log('MetricasMock initialized:', metricasMock); // Log for debugging
  }
  

  // Inicializar votos simulados para el gráfico
  function inicializarVotosMock() {
    casos.forEach((_, index) => {
      votosMock[index] = Math.floor(Math.random() * 100) + 50; // Simular entre 50-150 votos por caso
    });
  }

  // Generar pares de índices aleatorios
  function generarParesAleatorios() {
    const indices = [...Array(casos.length).keys()];
    mezclarArray(indices);
  
    for (let i = 0; i < indices.length; i += 2) {
      if (indices[i + 1] !== undefined) {
        const key = generarClave(indices[i], indices[i + 1]); // Use the helper function
        if (!metricasMock[key]) {
          console.error(`Key missing in metricasMock: ${key}`);
        }
        paresAleatorios.push([indices[i], indices[i + 1]]);
      }
    }
  
    console.log('Pares aleatorios generados:', paresAleatorios);
  }
  
  

  // Mezclar un array usando Fisher-Yates
  function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Mostrar el par actual de casos
  function mostrarCasos() {
    const contenedor = document.getElementById('casos-container');
    const metricasContenedor = document.getElementById('metricas-container');
    const botonContinuar = document.getElementById('continue-button');
    contenedor.innerHTML = '';
    metricasContenedor.innerHTML = '';
    botonContinuar.style.display = 'none'; // Hide "Continue" button initially
  
    if (indiceActual < paresAleatorios.length) {
      const [indiceA, indiceB] = paresAleatorios[indiceActual];
      const key = `${indiceA}-${indiceB}`;
  
      // Create and display Caso A
      const casoA = crearElementoCaso(casos[indiceA], indiceA);
      const casoB = crearElementoCaso(casos[indiceB], indiceB);
  
      // Append cases to the container
      contenedor.appendChild(casoA);
      contenedor.appendChild(casoB);
  
      // Attach events after rendering
      setTimeout(() => {
        casoA.onclick = () => registrarVoto(indiceA, indiceB, key);
        casoB.onclick = () => registrarVoto(indiceB, indiceA, key);
        console.log('Event listeners attached to cases.');
      }, 0); // Ensure DOM is updated before attaching events
    } else {
      mostrarGrafico(); // Show final graph if no more pairs
    }
  }
  
  
  // Create an HTML element for a case
  function crearElementoCaso(caso, indice) {
    const casoDiv = document.createElement('div');
    casoDiv.classList.add('case');
    casoDiv.innerHTML = `
      <h2>${caso.nombre}</h2>
      <p>${caso.descripcion}</p>
    `;
    return casoDiv;
  }

  // Crear un elemento HTML para un caso
  function crearElementoCaso(caso, indice) {
    const casoDiv = document.createElement('div');
    casoDiv.classList.add('case');
    casoDiv.innerHTML = `
      <h2>${caso.nombre}</h2>
      <p>${caso.descripcion}</p>
    `;
    return casoDiv;
  }

  // Registrar un voto y mostrar métricas
  function registrarVoto(casoSeleccionado, casoNoSeleccionado) {
    const key = generarClave(casoSeleccionado, casoNoSeleccionado);
    if (!metricasMock[key]) {
      console.warn(`Missing key: ${key}. Generating default metrics.`);
      metricasMock[key] = { porcentajeA: 50, porcentajeB: 50 };
    }
  
    const metricasContenedor = document.getElementById('metricas-container');
    const botonContinuar = document.getElementById('continue-button');
  
    const casoSeleccionadoNombre = casos[casoSeleccionado].nombre;
    const casoNoSeleccionadoNombre = casos[casoNoSeleccionado].nombre;
  
    // Get the raw percentages
    let porcentajeA = metricasMock[key].porcentajeA;
    let porcentajeB = metricasMock[key].porcentajeB;
  
    // Normalize percentages to sum to 100%
    const total = porcentajeA + porcentajeB;
    porcentajeA = Math.round((porcentajeA / total) * 100);
    porcentajeB = Math.round((porcentajeB / total) * 100);
  
    // Display the bars dynamically
    const metricasHTML = `
      <div class="percentage-bars">
        <div class="bar bar-left" style="width: ${porcentajeA}%;"></div>
        <div class="bar bar-right" style="width: ${porcentajeB}%;"></div>
      </div>
      <div class="percentage-labels">
        <span><strong>${porcentajeA}%</strong> eligieron <strong>${casoSeleccionadoNombre}</strong></span>
        <span><strong>${porcentajeB}%</strong> eligieron <strong>${casoNoSeleccionadoNombre}</strong></span>
      </div>
    `;
    metricasContenedor.innerHTML = metricasHTML;
  
    // Disable further clicks on case boxes
    const caseBoxes = document.querySelectorAll('.case');
    caseBoxes.forEach((box) => {
      box.onclick = null; // Remove click event
      box.classList.add('disabled'); // Add visual feedback
    });
  
    // Show "Continue" button
    botonContinuar.style.display = 'block';
    botonContinuar.onclick = avanzarAlSiguientePar;
  }
  
  

  // Avanzar al siguiente par
  function avanzarAlSiguientePar() {
    indiceActual++;
    sessionStorage.setItem('indiceActual', indiceActual); // Save progress
    mostrarCasos();
  }

  // Mostrar gráfico final con datos simulados
  function mostrarGrafico() {
    const graficoContenedor = document.getElementById('grafico-container');
    const prompt = document.getElementById('main-prompt'); // Target the prompt
  
    // Update the prompt text
    if (prompt) {
      prompt.textContent = 'Ranking de casos'; // New prompt text
    }
  
    // Display the graph container
    graficoContenedor.style.display = 'block';
  
    const ctx = document.getElementById('grafico-votos').getContext('2d');
    const nombres = casos.map((caso) => caso.nombre);
    const votos = Object.values(votosMock); // Use simulated data
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: nombres,
        datasets: [{
          label: 'Casos más votados como severos',
          data: votos,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  
    // Clear session storage at the end
    sessionStorage.clear();
  } 

  

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
  
});
