const songs = [
    { id: 1, name: "Bohemian Rhapsody", features: [144, 58, 355] },
    { id: 2, name: "Hotel California", features: [150, 60, 390] },
    { id: 3, name: "Billie Jean", features: [116, 52, 294] },
    { id: 4, name: "No Woman No Cry", features: [82, 55, 275] },
    { id: 5, name: "Wonderwall", features: [87, 50, 258] },
    { id: 6, name: "Like a Rolling Stone", features: [96, 53, 371] },
    { id: 7, name: "Redemption Song", features: [75, 54, 228] },
    { id: 8, name: "Imagine", features: [74, 48, 183] },
    { id: 9, name: "Sweet Child O' Mine", features: [125, 62, 356] },
    { id: 10, name: "Stairway to Heaven", features: [82, 57, 482] },
    { id: 11, name: "Shape of You", features: [96, 54, 233] },
    { id: 12, name: "Let It Be", features: [76, 51, 243] },
    { id: 13, name: "Is This Love", features: [91, 56, 230] },
    { id: 14, name: "Smells Like Teen Spirit", features: [117, 64, 301] },
    { id: 15, name: "With or Without You", features: [110, 55, 295] },
    { id: 16, name: "I Will Always Love You", features: [67, 49, 273] },
    { id: 17, name: "Three Little Birds", features: [76, 53, 180] },
    { id: 18, name: "Hallelujah", features: [78, 50, 282] },
    { id: 19, name: "Hey Jude", features: [72, 52, 431] },
    { id: 20, name: "Every Breath You Take", features: [110, 58, 251] }
];

// Función para calcular la distancia euclidiana
const euclideanDistance = (a, b) => Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));

// Clase Nodo
class Node {
    constructor(song) {
        this.song = song;
        this.radius = 0;
        this.inside = null;
        this.outside = null;
    }
}

// Clase VPTree
class VPTree {
    constructor(songs, distanceFunc) {
        this.distanceFunc = distanceFunc;
        this.root = this.buildTree(songs);
    }

    buildTree(songs) {
        if (songs.length === 0) return null;

        const index = Math.floor(Math.random() * songs.length);
        const song = songs[index];
        const node = new Node(song);

        songs.splice(index, 1);
        if (songs.length === 0) return node;

        const distances = songs.map(s => this.distanceFunc(song.features, s.features));
        const median = this.median(distances);

        node.radius = median;
        const insideSongs = songs.filter((s, i) => distances[i] <= median);
        const outsideSongs = songs.filter((s, i) => distances[i] > median);

        node.inside = this.buildTree(insideSongs);
        node.outside = this.buildTree(outsideSongs);

        return node;
    }

    median(values) {
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        return values[mid];
    }

    search(song, maxResults, node = this.root, neighbors = []) {
        if (!node) return neighbors;

        const dist = this.distanceFunc(song.features, node.song.features);
        if (neighbors.length < maxResults || dist < neighbors[0].distance) {
            neighbors.push({ song: node.song, distance: dist });
            neighbors.sort((a, b) => b.distance - a.distance);
            if (neighbors.length > maxResults) neighbors.shift();
        }

        const checkInsideFirst = dist < node.radius;
        if (checkInsideFirst) {
            this.search(song, maxResults, node.inside, neighbors);
            if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0].distance) {
                this.search(song, maxResults, node.outside, neighbors);
            }
        } else {
            this.search(song, maxResults, node.outside, neighbors);
            if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0].distance) {
                this.search(song, maxResults, node.inside, neighbors);
            }
        }

        return neighbors;
    }
}

const tree = new VPTree(songs, euclideanDistance);

document.getElementById('searchButton').addEventListener('click', () => {
    const tempo = parseFloat(document.getElementById('tempo').value);
    const pitch = parseFloat(document.getElementById('pitch').value);
    const duration = parseFloat(document.getElementById('duration').value);

    if (isNaN(tempo) || isNaN(pitch) || isNaN(duration)) {
        alert('Por favor, ingresa valores válidos para todas las características.');
        return;
    }

    const inputSong = { id: null, features: [tempo, pitch, duration] };
    const results = tree.search(inputSong, 3);

    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    resultsTable.innerHTML = '';

    results.forEach(result => {
        const row = resultsTable.insertRow();
        row.insertCell(0).innerText = result.song.id;
        row.insertCell(1).innerText = result.song.name;
        row.insertCell(2).innerText = result.song.features[0];
        row.insertCell(3).innerText = result.song.features[1];
        row.insertCell(4).innerText = result.song.features[2];
        row.insertCell(5).innerText = result.distance.toFixed(2);
    });
});
