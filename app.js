const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tareas = [];
let contadorId = 1;

const CATEGORIAS_VALIDAS = ['Estudio', 'Trabajo', 'Personal'];

function mostrarMenu() {
  console.log('\n=== GESTOR DE TAREAS ===');
  console.log('1. Agregar tarea');
  console.log('2. Listar todas las tareas (Pendientes / Completadas)');
  console.log('3. Marcar tarea como completada');
  console.log('4. Listar tareas por categoria');
  console.log('5. Salir');
  rl.question('Seleccione una opcion: ', manejarOpcion);
}


function agregarTarea() {
  pedirTitulo();
}

function pedirTitulo() {
  rl.question('Titulo: ', (titulo) => {
    const tituloLimpio = titulo.trim();
    if (tituloLimpio === '') {
      console.log('El titulo no puede estar vacio. Intente de nuevo.');
      return pedirTitulo();
    }
    pedirDescripcion(tituloLimpio);
  });
}

function pedirDescripcion(titulo) {
  rl.question('Descripcion: ', (descripcion) => {
    const descripcionLimpia = descripcion.trim();
    if (descripcionLimpia === '') {
      console.log('La descripcion no puede estar vacia. Intente de nuevo.');
      return pedirDescripcion(titulo);
    }
    pedirCategoria(titulo, descripcionLimpia);
  });
}

function pedirCategoria(titulo, descripcion) {
  rl.question('Categoria (Estudio / Trabajo / Personal): ', (categoria) => {
    const categoriaLimpia = categoria.trim();

    if (categoriaLimpia === '') {
      return guardarTarea(titulo, descripcion, 'Personal');
    }

    const categoriaValida = CATEGORIAS_VALIDAS.find(
      (cat) => cat.toLowerCase() === categoriaLimpia.toLowerCase()
    );

    if (!categoriaValida) {
      console.log('Categoria no valida. Debe ser Estudio, Trabajo o Personal.');
      return pedirCategoria(titulo, descripcion);
    }

    guardarTarea(titulo, descripcion, categoriaValida);
  });
}

function guardarTarea(titulo, descripcion, categoria) {
  const nuevaTarea = {
    id: contadorId++,
    titulo,
    descripcion,
    categoria,
    completada: false
  };
  tareas.push(nuevaTarea);
  console.log('Tarea agregada con exito.');
  mostrarMenu();
}


function listarTareas() {
  if (tareas.length === 0) {
    console.log('No hay tareas registradas.');
  } else {
    console.log('\n--- LISTADO DE TAREAS ---');
    tareas.forEach((t) => {
      const estado = t.completada ? '[Completada]' : '[Pendiente]';
      console.log(`${t.id}. ${t.titulo} - ${t.descripcion} | Categ: ${t.categoria} | Estado: ${estado}`);
    });
  }
  mostrarMenu();
}


function completarTarea() {
  rl.question('Ingrese el ID de la tarea a completar: ', (idStr) => {
    const idLimpio = idStr.trim();
    const id = parseInt(idLimpio, 10);

    if (idLimpio === '' || isNaN(id)) {
      console.log('Debe ingresar un numero de ID valido.');
      return mostrarMenu();
    }

    const tarea = tareas.find((t) => t.id === id);
    if (tarea) {
      if (tarea.completada) {
        console.log(`La tarea "${tarea.titulo}" ya estaba marcada como completada.`);
      } else {
        tarea.completada = true;
        console.log(`Tarea "${tarea.titulo}" marcada como completada.`);
      }
    } else {
      console.log('No se encontro una tarea con ese ID.');
    }
    mostrarMenu();
  });
}


function listarPorCategoria() {
  const agrupadas = tareas.reduce((acc, tarea) => {
    const cat = tarea.categoria;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(tarea);
    return acc;
  }, {});

  console.log('\n--- TAREAS AGRUPADAS POR CATEGORIA ---');
  if (Object.keys(agrupadas).length === 0) {
    console.log('No hay tareas para clasificar.');
  } else {
    for (const [categoria, lista] of Object.entries(agrupadas)) {
      console.log(`\nCategoria: ${categoria}`);
      lista.forEach((t) => {
        const estado = t.completada ? '[Completada]' : '[Pendiente]';
        console.log(`  - ${estado} ${t.titulo}: ${t.descripcion}`);
      });
    }
  }
  mostrarMenu();
}


function manejarOpcion(opcion) {
  switch (opcion.trim()) {
    case '1':
      agregarTarea();
      break;
    case '2':
      listarTareas();
      break;
    case '3':
      completarTarea();
      break;
    case '4':
      listarPorCategoria();
      break;
    case '5':
      console.log('Hasta luego!');
      rl.close();
      break;
    default:
      console.log('Opcion no valida.');
      mostrarMenu();
      break;
  }
}

mostrarMenu();