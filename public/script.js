document.addEventListener('DOMContentLoaded', () => {
  //---------------------------------------------------------------------------------------------------------------------------------
  // Chequeo de la página actual en la que nos encontramos
  // Se activa la correspondiente función para el html abierto
  const currentPage = window.location.pathname;

  if (currentPage.includes('index.html') || currentPage === '/') {
    inicializarPaginaPrincipal();
  } else if (currentPage.includes('todos-los-casos.html')) {
    inicializarTodosLosCasos();
  }

  //---------------------------------------------------------------------------------------------------------------------------------
  // Función que se ejecuta para index.html
  function inicializarPaginaPrincipal() {
    let casos = [];
    let currentIndex = 0;
    let randomIndices = [];

    // Fetch cases from the server
    fetch('/api/casos')
      .then(response => response.json())
      .then(data => {
        casos = data;
        generarIndicesAleatorios();
        mostrarCasos();
      })
      .catch(error => console.error('Error al cargar los casos:', error));

    // Generate random pairs of indices
    function generarIndicesAleatorios() {
      const numCasos = casos.length;
      const indices = Array.from({ length: numCasos }, (_, i) => i);

      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      for (let i = 0; i < indices.length; i += 2) {
        if (indices[i + 1] !== undefined) {
          randomIndices.push([indices[i], indices[i + 1]]);
        }
      }
    }

    // Función mostrarCasos():
    // Se utiliza para mostrar los casos de a pares, siempre y cuando el indice no sea mayor a la cantidad de casos
    // Se limpia la información del contenedor y se verifica no estar en caso límite
    // El par actual de casos (en base al indice) se añade al container mostrando su nombre y descripción
    // Si ya no hay más pares de casos, oculta botones de selección y muestra boton para cambiar de html
    // En el caso de haber casos impares, el último caso no tiene a quien comparar, no se mostrará
    // Extra: Se incluyo un botón para volver a la sección de inicio de la página
    function mostrarCasos() {
      const container = document.getElementById('casos-container');
      const metricasContenedor = document.getElementById('metricas-container');
      const botonContinuar = document.getElementById('continue-button');
      container.innerHTML = '';
      metricasContenedor.innerHTML = '';
      botonContinuar.style.display = 'none';

      if (currentIndex >= randomIndices.length) {
        mostrarGrafico(); // Show final graph if no more pairs
        return;
      }

      const parActual = randomIndices[currentIndex];
      const [indiceA, indiceB] = parActual;
      const casoA = crearElementoCaso(casos[indiceA], indiceA);
      const casoB = crearElementoCaso(casos[indiceB], indiceB);

      container.appendChild(casoA);
      container.appendChild(casoB);

      setTimeout(() => {
        casoA.onclick = () => registrarVoto(indiceA, indiceB);
        casoB.onclick = () => registrarVoto(indiceB, indiceA);
        console.log('Event listeners attached to cases.');
      }, 0);
    }

    // Función crearElementoCaso(caso)
    // Se utiliza para crear un elemento que contiene un caso dentro de la Law Machine
    function crearElementoCaso(caso) {
      const casoDiv = document.createElement('div');
      casoDiv.classList.add('case');
      casoDiv.innerHTML = `
        <h2>${caso.nombre}</h2>
        <p>${caso.descripcion}</p>
      `;
      return casoDiv;
    }

    // Función registrarVoto(casoSeleccionado, casoNoSeleccionado):
    // Se registra la selección del usuario en la votación de los casos dependiendo de los parámetros de la función 
    // Se identifica el par de casos usando los parámetros como indice, se hace un chequeo en caso de terminar de ver todos los casos
    // Una vez registrada la selección se muestra una barra de porcentaje que informa al usuario de la distribución de los votos entre ambas opciones para el par actual
    function registrarVoto(casoSeleccionado, casoNoSeleccionado) {
      casos[casoSeleccionado].conteo++;
      const totalVotos = casos[casoSeleccionado].conteo + casos[casoNoSeleccionado].conteo;

      const porcentajeA = Math.round((casos[casoSeleccionado].conteo / totalVotos) * 100);
      const porcentajeB = 100 - porcentajeA;

      const metricasContenedor = document.getElementById('metricas-container');
      const botonContinuar = document.getElementById('continue-button');

      const metricasHTML = `
        <div class="percentage-bars">
          <div class="bar bar-left" style="width: ${porcentajeA}%;"></div>
          <div class="bar bar-right" style="width: ${porcentajeB}%;"></div>
        </div>
        <div class="percentage-labels">
          <span><strong>${porcentajeA}%</strong> eligieron <strong>${casos[casoSeleccionado].nombre}</strong></span>
          <span><strong>${porcentajeB}%</strong> eligieron <strong>${casos[casoNoSeleccionado].nombre}</strong></span>
        </div>
      `;
      metricasContenedor.innerHTML = metricasHTML;

      const caseBoxes = document.querySelectorAll('.case');
      caseBoxes.forEach((box) => {
        box.onclick = null;
        box.classList.add('disabled');
      });

      botonContinuar.style.display = 'block';
      botonContinuar.onclick = avanzarAlSiguientePar;
    }

    // Función para cambiar de par
    function avanzarAlSiguientePar() {
      currentIndex++;
      mostrarCasos();
    }

    // Función mostrarGráfico()
    // Función para mostrar el ranking de los casos entre todos los casos
    // Permite que los usuarios puedan ver cuales crimenes/delitos se consideraron como los mas graves en general
    function mostrarGrafico() {
      const graficoContenedor = document.getElementById('grafico-container');
      const prompt = document.getElementById('main-prompt');

      if (prompt) {
        prompt.textContent = 'Ranking de casos';
      }

      graficoContenedor.style.display = 'block';

      const ctx = document.getElementById('grafico-votos').getContext('2d');
      const sortedData = [...casos].sort((a, b) => b.conteo - a.conteo);
      const nombres = sortedData.map(caso => caso.nombre);
      const votos = sortedData.map(caso => caso.conteo);

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
    }

    // Botón para volver a la página de inicio
    document.getElementById('home-btn').addEventListener('click', () => {
        window.location.href = 'welcome.html';
    });
  }

  //---------------------------------------------------------------------------------------------------------------------------------
  // Función que se ejecuta para todos-los-casos.html
  function inicializarTodosLosCasos() {
    const container = document.getElementById('todos-casos-container');

    // Se obtienen todos los casos y se ordenan en cierto formato html
    fetch('/api/casos')
      .then(response => response.json())
      .then(data => {
        data.forEach(caso => {
          const casoDiv = document.createElement('div');
          casoDiv.classList.add('caso');
          casoDiv.innerHTML = `
            <h2>${caso.nombre}</h2>
            <p><strong>Veces seleccionado:</strong> ${caso.conteo}</p>
          `;
          container.appendChild(casoDiv);
        });
      })
      .catch(error => console.error('Error al cargar los casos:', error));
  }
});
