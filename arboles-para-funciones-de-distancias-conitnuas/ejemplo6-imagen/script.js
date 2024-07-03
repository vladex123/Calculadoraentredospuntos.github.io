const images = [
    { id: 1, features: [0.8, 0.6, 0.7], src: 'imagenes/imagen1.png' }, // [color promedio, textura, forma]
    { id: 2, features: [0.7, 0.5, 0.6], src: 'imagenes/imagen2.png' },
    { id: 3, features: [0.6, 0.4, 0.5], src: 'imagenes/imagen3.png' },
    { id: 4, features: [0.75, 0.55, 0.65], src: 'imagenes/imagen4.png' },
    { id: 5, features: [0.85, 0.62, 0.72], src: 'imagenes/imagen5.png' },
    { id: 6, features: [0.78, 0.58, 0.68], src: 'imagenes/imagen6.png' },
    { id: 7, features: [0.72, 0.53, 0.63], src: 'imagenes/imagen7.png' },
    { id: 8, features: [0.73, 0.54, 0.64], src: 'imagenes/imagen8.png' },
    { id: 9, features: [0.84, 0.61, 0.71], src: 'imagenes/imagen9.png' },
    { id: 10, features: [0.82, 0.59, 0.69], src: 'imagenes/imagen10.png' },
    { id: 11, features: [0.77, 0.57, 0.67], src: 'imagenes/imagen11.png' },
    { id: 12, features: [0.79, 0.56, 0.66], src: 'imagenes/imagen12.png' },
];

// Función para calcular la distancia euclidiana entre características de imágenes
const euclideanDistance = (a, b) => Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));

// Clase Nodo para el árbol VP
class Node {
    constructor(image) {
        this.image = image;
        this.radius = 0;
        this.inside = null;
        this.outside = null;
    }
}

// Clase VPTree para construir y buscar en el árbol VP
class VPTree {
    constructor(images, distanceFunc) {
        this.distanceFunc = distanceFunc;
        this.root = this.buildTree(images);
    }

    // Método para construir el árbol VP
    buildTree(images) {
        if (images.length === 0) return null;

        const index = Math.floor(Math.random() * images.length);
        const image = images[index];
        const node = new Node(image);

        images.splice(index, 1);
        if (images.length === 0) return node;

        const distances = images.map(s => this.distanceFunc(image.features, s.features));
        const median = this.median(distances);

        node.radius = median;
        const insideImages = images.filter((s, i) => distances[i] <= median);
        const outsideImages = images.filter((s, i) => distances[i] > median);

        node.inside = this.buildTree(insideImages);
        node.outside = this.buildTree(outsideImages);

        return node;
    }

    // Método para encontrar la mediana
    median(values) {
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        return values[mid];
    }

    // Método de búsqueda en el árbol VP
    search(image, maxResults, node = this.root, neighbors = []) {
        if (!node) return neighbors;

        const dist = this.distanceFunc(image.features, node.image.features);
        if (neighbors.length < maxResults || dist < neighbors[0].distance) {
            neighbors.push({ image: node.image, distance: dist });
            neighbors.sort((a, b) => b.distance - a.distance);
            if (neighbors.length > maxResults) neighbors.shift();
        }

        const checkInsideFirst = dist < node.radius;
        if (checkInsideFirst) {
            this.search(image, maxResults, node.inside, neighbors);
            if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0].distance) {
                this.search(image, maxResults, node.outside, neighbors);
            }
        } else {
            this.search(image, maxResults, node.outside, neighbors);
            if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0].distance) {
                this.search(image, maxResults, node.inside, neighbors);
            }
        }

        return neighbors;
    }
}

// Crear el árbol VP
const tree = new VPTree(images, euclideanDistance);

// Manejar la búsqueda de imágenes similares
document.getElementById('searchButton').addEventListener('click', () => {
    const color = parseFloat(document.getElementById('color').value);
    const texture = parseFloat(document.getElementById('texture').value);
    const shape = parseFloat(document.getElementById('shape').value);

    if (isNaN(color) || isNaN(texture) || isNaN(shape)) {
        alert('Please enter valid values for all features.');
        return;
    }

    const inputImage = { id: null, features: [color, texture, shape] };
    const results = tree.search(inputImage, 3);

    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'result-card';

        const img = document.createElement('img');
        img.src = result.image.src;
        card.appendChild(img);

        const info = document.createElement('div');
        info.className = 'info';
        info.innerHTML = `
            <p>ID: ${result.image.id}</p>
            <p>Color: ${result.image.features[0]}</p>
            <p>Texture: ${result.image.features[1]}</p>
            <p>Shape: ${result.image.features[2]}</p>
            <p>Distance: ${result.distance.toFixed(2)}</p>
        `;
        card.appendChild(info);

        resultsContainer.appendChild(card);
    });
});
