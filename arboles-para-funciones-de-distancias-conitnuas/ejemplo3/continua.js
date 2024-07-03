// Definición de la clase VP-Tree
class VPTree {
    constructor(points = [], distanceFunction = (a, b) => Math.sqrt(a.reduce((sum, _, i) => sum + (a[i] - b[i]) ** 2, 0))) {
        this.distanceFunction = distanceFunction;
        this.root = this.buildTree(points);
    }

    buildTree(points) {
        if (points.length === 0) return null;
        if (points.length === 1) return { point: points[0], radius: 0, inner: null, outer: null };

        const vantagePoint = points[0];
        const distances = points.slice(1).map(point => ({ point, distance: this.distanceFunction(vantagePoint, point) }));

        distances.sort((a, b) => a.distance - b.distance);
        const medianIndex = Math.floor(distances.length / 2);
        const radius = distances[medianIndex].distance;

        return {
            point: vantagePoint,
            radius,
            inner: this.buildTree(distances.slice(0, medianIndex).map(({ point }) => point)),
            outer: this.buildTree(distances.slice(medianIndex).map(({ point }) => point)),
        };
    }

    search(point, threshold) {
        const results = [];
        this._search(this.root, point, threshold, results);
        return results;
    }

    _search(node, point, threshold, results) {
        if (!node) return;

        const distance = this.distanceFunction(node.point, point);
        if (distance <= threshold) results.push({ point: node.point, distance });

        if (distance - threshold <= node.radius) this._search(node.inner, point, threshold, results);
        if (distance + threshold >= node.radius) this._search(node.outer, point, threshold, results);
    }
}

// Datos de ejemplo (tempo, pitch, duración)
const songs = [
    { id: 'A', features: [120, 440, 200] },
    { id: 'B', features: [125, 450, 190] },
    { id: 'C', features: [130, 430, 220] },
    { id: 'D', features: [128, 445, 210] },
    { id: 'E', features: [132, 435, 205] },
];

// Crear un VP-Tree con las canciones
const vpTree = new VPTree(songs.map(song => song.features));

// Función para buscar canciones similares a una consulta
function recommendSongs(queryFeatures, threshold) {
    const similarSongs = vpTree.search(queryFeatures, threshold);
    return similarSongs.map(result => ({
        id: songs.find(song => song.features === result.point).id,
        distance: result.distance,
    }));
}

// Ejemplo de búsqueda
const query = [127, 440, 200]; // Consulta de ejemplo
const threshold = 15; // Umbral de búsqueda

const recommendations = recommendSongs(query, threshold);
console.log('Recomendaciones:', recommendations);
