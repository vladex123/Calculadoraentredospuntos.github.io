class Nodo {
    constructor(libro) {
        this.libro = libro;
        this.izquierda = null;
        this.derecha = null;
    }
}

class ArbolBinarioBusqueda {
    constructor() {
        this.raiz = null;
    }

    insertar(libro) {
        libro.id = parseInt(libro.id);
        this.raiz = this._insertarRecursivo(this.raiz, libro);
    }

    _insertarRecursivo(nodo, libro) {
        if (nodo === null) {
            return new Nodo(libro);
        }

        if (libro.id < nodo.libro.id) {
            nodo.izquierda = this._insertarRecursivo(nodo.izquierda, libro);
        } else if (libro.id > nodo.libro.id) {
            nodo.derecha = this._insertarRecursivo(nodo.derecha, libro);
        }

        return nodo;
    }

    buscar(id) {
        return this._buscarRecursivo(this.raiz, parseInt(id));
    }

    _buscarRecursivo(nodo, id) {
        if (nodo === null || nodo.libro.id === id) {
            return nodo ? nodo.libro : null;
        }

        if (id < nodo.libro.id) {
            return this._buscarRecursivo(nodo.izquierda, id);
        }
        return this._buscarRecursivo(nodo.derecha, id);
    }

    eliminar(id) {
        this.raiz = this._eliminarRecursivo(this.raiz, parseInt(id));
    }

    _eliminarRecursivo(nodo, id) {
        if (nodo === null) {
            return null;
        }

        if (id < nodo.libro.id) {
            nodo.izquierda = this._eliminarRecursivo(nodo.izquierda, id);
        } else if (id > nodo.libro.id) {
            nodo.derecha = this._eliminarRecursivo(nodo.derecha, id);
        } else {
            if (nodo.izquierda === null) {
                return nodo.derecha;
            } else if (nodo.derecha === null) {
                return nodo.izquierda;
            }

            nodo.libro = this._encontrarMinimo(nodo.derecha);
            nodo.derecha = this._eliminarRecursivo(nodo.derecha, nodo.libro.id);
        }

        return nodo;
    }

    _encontrarMinimo(nodo) {
        let actual = nodo;
        while (actual.izquierda !== null) {
            actual = actual.izquierda;
        }
        return actual.libro;
    }
}

const bst = new ArbolBinarioBusqueda();

fetch('obtener_libros.php')
    .then(response => response.json())
    .then(data => {
        data.forEach(libro => {
            libro.id = parseInt(libro.id);
            bst.insertar(libro);
        });
        console.log('Libros cargados en BST:', data.length);
        habilitarUI();
    })
    .catch(error => console.error('Error:', error));

function habilitarUI() {
    document.querySelectorAll('input, button').forEach(el => el.disabled = false);
}

function mostrarResultado(mensaje) {
    document.getElementById('resultado').textContent = mensaje;
}

function buscarLibro() {
    const id = parseInt(document.getElementById('buscarId').value);
    const libro = bst.buscar(id);

    if (libro) {
        mostrarResultado(`Libro encontrado: ID ${libro.id}, Título: ${libro.titulo}, Autor: ${libro.autor}`);
    } else {
        mostrarResultado(`No se encontró ningún libro con el ID ${id}`);
    }
}

function insertarLibro() {
    const id = parseInt(document.getElementById('insertId').value);
    const titulo = document.getElementById('insertTitulo').value;
    const autor = document.getElementById('insertAutor').value;

    if (id && titulo && autor) {
        const libro = {id, titulo, autor};
        bst.insertar(libro);
        mostrarResultado(`Libro insertado: ID ${id}, Título: ${titulo}, Autor: ${autor}`);
    } else {
        mostrarResultado('Error: Todos los campos son obligatorios');
    }
}

function eliminarLibro() {
    const id = parseInt(document.getElementById('eliminarId').value);
    const libroAEliminar = bst.buscar(id);
    if (libroAEliminar) {
        bst.eliminar(id);
        mostrarResultado(`Libro con ID ${id} eliminado correctamente`);
    } else {
        mostrarResultado(`No se encontró ningún libro con el ID ${id}`);
    }
}