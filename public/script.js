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
    return a < b ? `${a}-${b}` : `${b}-${a}`;
  }
    
  // Inicializar métricas simuladas
  function inicializarMetricasMock() {
    metricasMock = {};
  
    for (let i = 0; i < casos.length; i++) {
      for (let j = i + 1; j < casos.length; j++) {
        const key = generarClave(i, j);
  
        const porcentajeA = Math.floor(Math.random() * 101);
        const porcentajeB = 100 - porcentajeA;
          
        metricasMock[key] = {
          porcentajeA,
          porcentajeB,
        };
      }
    }
  
    console.log('MetricasMock initialized:', metricasMock);
  }
  

  // Inicializar votos simulados para el gráfico
  function inicializarVotosMock() {
    casos.forEach((_, index) => {
      votosMock[index] = Math.floor(Math.random() * 100) + 50;
    });
  }

  // Generar pares de índices aleatorios
  function generarParesAleatorios() {
    const indices = [...Array(casos.length).keys()];
    mezclarArray(indices);
  
    for (let i = 0; i < indices.length; i += 2) {
      if (indices[i + 1] !== undefined) {
        const key = generarClave(indices[i], indices[i + 1]);
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
    botonContinuar.style.display = 'none';
  
    if (indiceActual < paresAleatorios.length) {
      const [indiceA, indiceB] = paresAleatorios[indiceActual];
      const key = `${indiceA}-${indiceB}`;
  
      const casoA = crearElementoCaso(casos[indiceA], indiceA);
      const casoB = crearElementoCaso(casos[indiceB], indiceB);
  
      contenedor.appendChild(casoA);
      contenedor.appendChild(casoB);
  
      setTimeout(() => {
        casoA.onclick = () => registrarVoto(indiceA, indiceB, key);
        casoB.onclick = () => registrarVoto(indiceB, indiceA, key);
        console.log('Event listeners attached to cases.');
      }, 0);
    } else {
      mostrarGrafico();
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
  function registrarVoto(casoSeleccionado, casoNoSeleccionado, key) {
  const keyLocalStorage = `vote-${key}`;
  const lastVoted = localStorage.getItem('last-voted');
  const cooldownPeriod = 5 * 60 * 1000;

  if (localStorage.getItem(keyLocalStorage)) {
    console.log('Ya has votado en este par. Redirigiendo al ranking...');
    mostrarGrafico();
    return;
  }

  if (lastVoted && Date.now() - parseInt(lastVoted, 10) < cooldownPeriod) {
    console.log('Cooldown activo. Redirigiendo al ranking...');
    mostrarGrafico();
    return;
  }

  localStorage.setItem('last-voted', Date.now());

  localStorage.setItem(keyLocalStorage, JSON.stringify({ casoSeleccionado, casoNoSeleccionado }));

  const keyMetricas = generarClave(casoSeleccionado, casoNoSeleccionado);
  if (!metricasMock[keyMetricas]) {
    console.warn(`Missing key: ${keyMetricas}. Generating default metrics.`);
    metricasMock[keyMetricas] = { porcentajeA: 50, porcentajeB: 50 };
  }

  const metricasContenedor = document.getElementById('metricas-container');
  const botonContinuar = document.getElementById('continue-button');

  const casoSeleccionadoNombre = casos[casoSeleccionado].nombre;
  const casoNoSeleccionadoNombre = casos[casoNoSeleccionado].nombre;

  const porcentajeA = metricasMock[keyMetricas].porcentajeA;
  const porcentajeB = metricasMock[keyMetricas].porcentajeB;

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

  
  const caseBoxes = document.querySelectorAll('.case');
  caseBoxes.forEach((box) => {
    box.onclick = null;
    box.classList.add('disabled');
  });

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

  if (prompt) {
    prompt.textContent = 'Ranking de casos';
  }

  graficoContenedor.style.display = 'block';

  const ctx = document.getElementById('grafico-votos').getContext('2d');

  const data = casos.map((caso, index) => ({
    nombre: caso.nombre,
    votos: votosMock[index] || 0,
  }));

  const sortedData = data.sort((a, b) => b.votos - a.votos);

  const nombresOrdenados = sortedData.map((item) => item.nombre);
  const votosOrdenados = sortedData.map((item) => item.votos);

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

  sessionStorage.clear();
}
  
  
});
