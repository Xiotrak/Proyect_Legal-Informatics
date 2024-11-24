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
      container.innerHTML = '';
    
      if (currentIndex >= randomIndices.length) {
        inicializarTodosLosCasos();
        window.location.href = 'todos-los-casos.html';
        return;
      }
    
      const parActual = randomIndices[currentIndex];
      const [indiceIzquierdo, indiceDerecho] = parActual;
      const casoA = crearElementoCaso(casos[indiceIzquierdo], indiceIzquierdo);
      const casoB = crearElementoCaso(casos[indiceDerecho], indiceDerecho);
    
      container.appendChild(casoA);
      container.appendChild(casoB);
    
      setTimeout(() => {
        casoA.onclick = () => registrarVoto(indiceIzquierdo, indiceDerecho, 0);
        casoB.onclick = () => registrarVoto(indiceDerecho, indiceIzquierdo, 1);
        console.log("Event listeners attached to cases.");
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
    function registrarVoto(casoSeleccionado, casoNoSeleccionado, posicion) {
      fetch('/api/actualizar-conteo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: casos[casoSeleccionado].id })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            casos[casoSeleccionado].conteo = data.conteo; // Update the local copy of the case
            const totalVotos =
              casos[casoSeleccionado].conteo + casos[casoNoSeleccionado].conteo;
    
            // Determine percentages
            const porcentajeSeleccionado = Math.round(
              (casos[casoSeleccionado].conteo / totalVotos) * 100
            );
            const porcentajeNoSeleccionado = 100 - porcentajeSeleccionado;
    
            // Ensure correct bar placement
            const porcentajeIzquierdo = posicion === 0 ? porcentajeSeleccionado : porcentajeNoSeleccionado;
            const porcentajeDerecho = posicion === 1 ? porcentajeSeleccionado : porcentajeNoSeleccionado;
    
            const metricasContenedor = document.getElementById('metricas-container');
            const botonContinuar = document.getElementById('continue-button');
    
            const metricasHTML = `
              <div class="percentage-bars">
                <div class="bar bar-left" style="width: ${porcentajeIzquierdo}%;"></div>
                <div class="bar bar-right" style="width: ${porcentajeDerecho}%;"></div>
              </div>
              <div class="percentage-labels">
                <span><strong>${porcentajeIzquierdo}%</strong> eligieron <strong>${casos[0].nombre}</strong></span>
                <span><strong>${porcentajeDerecho}%</strong> eligieron <strong>${casos[1].nombre}</strong></span>
              </div>
            `;
            metricasContenedor.innerHTML = metricasHTML;
    
            // Disable further clicks
            const caseBoxes = document.querySelectorAll('.case');
            caseBoxes.forEach((box) => {
              box.onclick = null;
              box.classList.add('disabled');
            });
    
            // Show "Continue" button
            botonContinuar.style.display = 'block';
            botonContinuar.onclick = avanzarAlSiguientePar;
          } else {
            console.error(data.message);
          }
        })
        .catch(error => console.error('Error al actualizar conteo:', error));
    }
    

    // Funcion avanzarAlSiguientePar()
    // Función para cambiar de par una vez se vota
    // Simula un tiempo de carga de 2 segundos antes de mostrar el siguiente par para evitar spamming
    function avanzarAlSiguientePar() {
      const loadingIndicator = document.getElementById('loading-indicator');
    
      // Mostrar el indicador de carga
      loadingIndicator.style.display = 'flex';
    
      // Ocultar el indicador de carga y continuar después de 1.5 segundos
      setTimeout(() => {
        loadingIndicator.style.display = 'none';
        currentIndex++;
    
        if (currentIndex >= randomIndices.length) {
          // Guardar datos de conteo en localStorage
          localStorage.setItem('conteoData', JSON.stringify(casos));
    
          // Redirigir a todos-los-casos.html al completar
          window.location.href = 'todos-los-casos.html';
        } else {
          mostrarCasos();
        }
      }, 1500);
    }
    
    // Botón para volver a la página de inicio
    document.getElementById('home-btn').addEventListener('click', () => {
      window.location.href = 'welcome.html';
    });
  }    

  //---------------------------------------------------------------------------------------------------------------------------------
  // Función que se ejecuta para todos-los-casos.html
  // Tambien muestra el grafico de ranking
  function inicializarTodosLosCasos() {
    const container = document.getElementById('todos-casos-container');
    const ctx = document.getElementById('grafico-votos').getContext('2d');
  
    // Retrieve updated data from localStorage if available
    const conteoData = JSON.parse(localStorage.getItem('conteoData'));
  
    // If localStorage has data, use it; otherwise, fetch from server
    if (conteoData && conteoData.length > 0) {
      renderCasosAndGraph(conteoData);
    } else {
      // Fetch cases from the server as a fallback
      fetch('/api/casos')
        .then(response => response.json())
        .then(casos => {
          renderCasosAndGraph(casos);
        })
        .catch(error => console.error('Error al cargar los casos:', error));
    }
  
    // Function to render cases and graph
    function renderCasosAndGraph(casos) {
      // Clear the container
      container.innerHTML = '';
  
      // Render the cases
      casos.forEach(caso => {
        const casoDiv = document.createElement('div');
        casoDiv.classList.add('caso');
        casoDiv.innerHTML = `
          <h2>${caso.nombre}</h2>
          <p><strong>Veces seleccionado:</strong> ${caso.conteo}</p>
        `;
        container.appendChild(casoDiv);
      });
  
      // Sort cases by votes for the graph
      const sortedCasos = [...casos].sort((a, b) => b.conteo - a.conteo);
      const nombres = sortedCasos.map(caso => caso.nombre);
      const votos = sortedCasos.map(caso => caso.conteo);
  
      // Render the graph
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: nombres,
          datasets: [{
            label: 'Veces seleccionado',
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
  
    // Add functionality to the return button
    document.getElementById('volver-btn').addEventListener('click', () => {
      window.location.href = 'welcome.html';
    });
  }  
});
