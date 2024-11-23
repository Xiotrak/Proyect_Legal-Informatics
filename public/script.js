// public/script.js
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

  const casoA = casos[casoSeleccionado];
  const casoB = casos[casoNoSeleccionado];

  const porcentajeA = metricasMock[key].porcentajeA;
  const porcentajeB = metricasMock[key].porcentajeB;

  // Display the bars dynamically
  const metricasHTML = `
    <div class="percentage-bars">
      <div class="bar bar-left" style="width: ${porcentajeA}%;"></div>
      <div class="bar bar-right" style="width: ${porcentajeB}%;"></div>
    </div>
    <div class="percentage-labels">
      <span><strong>${porcentajeA}%</strong> eligieron <strong>${casoA.nombre}</strong></span>
      <span><strong>${porcentajeB}%</strong> eligieron <strong>${casoB.nombre}</strong></span>
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
  const prompt = document.getElementById('main-prompt'); // Target the prompt element

  // Update the prompt text
  if (prompt) {
    prompt.textContent = 'Ranking de casos';
  }

  // Display the graph container
  graficoContenedor.style.display = 'block';

  const ctx = document.getElementById('grafico-votos').getContext('2d');

  // Combine case names with their corresponding votes
  const data = casos.map((caso, index) => ({
    nombre: caso.nombre,
    votos: votosMock[index] || 0, // Ensure default value if votesMock is undefined
  }));

  // Sort data by votes in descending order
  const sortedData = data.sort((a, b) => b.votos - a.votos);

  // Extract sorted names and votes
  const nombresOrdenados = sortedData.map((item) => item.nombre);
  const votosOrdenados = sortedData.map((item) => item.votos);

  // Create the chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nombresOrdenados,
      datasets: [{
        label: 'Casos más votados como severos',
        data: votosOrdenados,
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
  
  
});
