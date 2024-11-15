// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  let casos = [];
  let currentIndex = 0;
  let randomIndices = []; // Lista de índices aleatorios

  // Obtener los casos del servidor
  fetch('/api/casos')
    .then(response => response.json())
    .then(data => {
      casos = data;
      generarIndicesAleatorios();
      mostrarCasos();
    })
    .catch(error => console.error('Error al cargar los casos:', error));

  // Generar una lista de índices aleatorios en pares
  function generarIndicesAleatorios() {
    const numCasos = casos.length;
    const indices = Array.from({ length: numCasos }, (_, i) => i);
    
    // Mezclar el arreglo de índices de manera aleatoria
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Dividir los índices en pares y almacenarlos en randomIndices
    for (let i = 0; i < indices.length; i += 2) {
      randomIndices.push(indices.slice(i, i + 2));
    }
  }

  // Mostrar los casos en pares aleatorios
  function mostrarCasos() {
    const container = document.getElementById('casos-container');
    container.innerHTML = ''; // Limpiar contenedor

    // Obtener el par de índices actual y mostrar los casos
    const parActual = randomIndices[currentIndex];
    parActual.forEach(index => {
      if (index < casos.length) { // Verificar que el índice esté dentro del rango
        const caso = casos[index];
        const casoDiv = document.createElement('div');
        casoDiv.classList.add('caso');
        casoDiv.innerHTML = `<h2>${caso.nombre}</h2><p>${caso.descripcion}</p>`;
        container.appendChild(casoDiv);
      }
    });

    // Desactivar botones si es necesario y mostrar el botón "Ver Todo" al final
    document.getElementById('prev-btn').disabled = currentIndex === 0;
    document.getElementById('next-btn').disabled = currentIndex + 1 >= randomIndices.length;
    document.getElementById('show-all-btn').style.display = currentIndex + 1 >= randomIndices.length ? 'block' : 'none';
  }

  // Función para mostrar el listado completo de los casos
  function mostrarTodo() {
    const container = document.getElementById('casos-container');
    container.innerHTML = ''; // Limpiar contenedor

    // Mostrar todos los casos
    casos.forEach(caso => {
      const casoDiv = document.createElement('div');
      casoDiv.classList.add('caso');
      casoDiv.innerHTML = `<h2>${caso.nombre}</h2><p>${caso.descripcion}</p>`;
      container.appendChild(casoDiv);
    });

    // Ocultar los botones de navegación y "Ver Todo"
    document.getElementById('prev-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('show-all-btn').style.display = 'none';
  }

  //------------------------------------------------------------------------------------------------------------------------------------
  
  // Evento para el botón "Anterior"
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      mostrarCasos();
    }
  });

  // Evento para el botón "Siguiente"
  document.getElementById('next-btn').addEventListener('click', () => {
    if (currentIndex + 1 < randomIndices.length) {
      currentIndex++;
      mostrarCasos();
    }
  });

  // Evento para el botón "Ver Todo"
  document.getElementById('show-all-btn').addEventListener('click', mostrarTodo);
});
