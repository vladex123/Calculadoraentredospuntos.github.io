// Definir el conjunto de datos de canciones (ejemplo simplificado)
const songs = [
    { id: 1, title: "Song A", tempo: 120, pitch: 55, duration: 210 },
    { id: 2, title: "Song B", tempo: 130, pitch: 60, duration: 200 },
    { id: 3, title: "Song C", tempo: 110, pitch: 53, duration: 180 },
    { id: 4, title: "Song D", tempo: 125, pitch: 58, duration: 240 },
    { id: 5, title: "Song E", tempo: 140, pitch: 65, duration: 220 }
    // Más canciones...
];

// Función para calcular la distancia euclidiana entre dos canciones
function euclideanDistance(song1, song2) {
    const features1 = [song1.tempo, song1.pitch, song1.duration];
    const features2 = [song2.tempo, song2.pitch, song2.duration];
    return Math.sqrt(
        features1.reduce((acc, val, idx) => acc + (val - features2[idx]) ** 2, 0)
    );
}

// Clase Node para representar un nodo en el Árbol VP
class Node {
    constructor(song) {
        this.song = song;
        this.radius = 0;
        this.inside = null;
        this.outside = null;
    }
}

// Clase VPTree para construir y buscar en el Árbol VP
class VPTree {
    constructor(songs, distanceFunc) {
        this.root = this.buildTree(songs);
        this.distanceFunc = distanceFunc;
    }

    // Función para construir el Árbol VP de manera recursiva
    buildTree(songs) {
        if (songs.length === 0) return null;

        // Seleccionar un punto de referencia aleatorio
        const index = Math.floor(Math.random() * songs.length);
        const song = songs[index];
        const node = new Node(song);
        songs.splice(index, 1);

        if (songs.length === 0) return node;

        // Calcular las distancias al punto de referencia
        const distances = songs.map(s => this.distanceFunc(song, s));
        const median = this.median(distances);
        node.radius = median;

        // Separar las canciones en dos conjuntos
        const insideSongs = songs.filter((s, i) => distances[i] <= median);
        const outsideSongs = songs.filter((s, i) => distances[i] > median);

        // Construir recursivamente los subárboles
        node.inside = this.buildTree(insideSongs);
        node.outside = this.buildTree(outsideSongs);

        return node;
    }

    // Función para calcular la mediana de un conjunto de distancias
    median(values) {
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        return values[mid];
    }

    // Función para buscar las canciones más similares en el Árbol VP
    search(inputSong, maxResults, node = this.root, neighbors = []) {
        if (!node) return neighbors;

        // Calcular la distancia entre la canción de entrada y la canción en el nodo actual
        const dist = this.distanceFunc(inputSong, node.song);

        // Actualizar la lista de vecinos más cercanos
        if (neighbors.length < maxResults || dist < neighbors[0].distance) {
            neighbors.push({ song: node.song, distance: dist });
            neighbors.sort((a, b) => b.distance - a.distance);
            if (neighbors.length > maxResults) neighbors.pop();
        }

        // Decidir en qué subárbol continuar la búsqueda
        const checkInsideFirst = dist < node.radius;
        if (checkInsideFirst) {
            this.search(inputSong, maxResults, node.inside, neighbors);
            if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0].distance) {
                this.search(inputSong, maxResults, node.outside, neighbors);
            }
        } else {
            this.search(inputSong, maxResults, node.outside, neighbors);
            if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0].distance) {
                this.search(inputSong, maxResults, node.inside, neighbors);
            }
        }

        return neighbors;
    }
}

// Crear una instancia de VPTree con las canciones y la distancia euclidiana
const vpTree = new VPTree(songs, euclideanDistance);

// Función para manejar la búsqueda de canciones similares desde la interfaz
function searchSimilarSongs() {
    const tempo = parseInt(document.getElementById("tempo").value);
    const pitch = parseInt(document.getElementById("pitch").value);
    const duration = parseInt(document.getElementById("duration").value);

    // Crear un objeto con las características de la canción de consulta
    const querySong = { tempo, pitch, duration };

    // Ejecutar la búsqueda en el Árbol VP
    const maxResults = 3; // Número máximo de resultados a mostrar
    const similarSongs = vpTree.search(querySong, maxResults);

    // Mostrar los resultados en la interfaz
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = ""; // Limpiar resultados anteriores

    similarSongs.forEach((result, idx) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${idx + 1}. ${result.song.title} (Distancia: ${result.distance.toFixed(2)})`;
        resultsList.appendChild(listItem);
    });
}
