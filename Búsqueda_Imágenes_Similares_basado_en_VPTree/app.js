// Implementación de VPTree
class VPTree {
    constructor(points, distance) {
        this.distance = distance;
        this.root = this.buildVPTree(points);
    }

    buildVPTree(points) {
        if (points.length === 0) return null;

        const vpIndex = Math.floor(Math.random() * points.length);
        const vp = points[vpIndex];
        points.splice(vpIndex, 1);

        if (points.length === 0) return { vp: vp, left: null, right: null, mu: 0 };

        const distances = points.map(p => this.distance(vp, p));
        const mu = this.median(distances);

        const leftPoints = [];
        const rightPoints = [];
        for (let i = 0; i < points.length; i++) {
            if (distances[i] < mu) {
                leftPoints.push(points[i]);
            } else {
                rightPoints.push(points[i]);
            }
        }

        return {
            vp: vp,
            mu: mu,
            left: this.buildVPTree(leftPoints),
            right: this.buildVPTree(rightPoints)
        };
    }

    median(arr) {
        const sorted = arr.slice().sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    searchKNN(query, k) {
        const tau = Infinity;
        const neighbors = [];
        this._searchKNN(this.root, query, k, tau, neighbors);
        return neighbors.sort((a, b) => a.dist - b.dist);
    }

    _searchKNN(node, query, k, tau, neighbors) {
        if (node === null) return tau;

        const dist = this.distance(query, node.vp);

        if (dist < tau) {
            neighbors.push({ vp: node.vp, dist: dist });
            if (neighbors.length > k) {
                neighbors.sort((a, b) => a.dist - b.dist);
                neighbors.pop();
                tau = neighbors[neighbors.length - 1].dist;
            } else if (neighbors.length === k) {
                tau = Math.max(tau, dist);
            }
        }

        if (node.left === null && node.right === null) {
            return tau;
        }

        if (dist < node.mu) {
            if (dist - tau <= node.mu) {
                tau = this._searchKNN(node.left, query, k, tau, neighbors);
            }
            if (dist + tau > node.mu) {
                tau = this._searchKNN(node.right, query, k, tau, neighbors);
            }
        } else {
            if (dist + tau > node.mu) {
                tau = this._searchKNN(node.right, query, k, tau, neighbors);
            }
            if (dist - tau <= node.mu) {
                tau = this._searchKNN(node.left, query, k, tau, neighbors);
            }
        }

        return tau;
    }
}

// Función de distancia euclidiana
function euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

// Variables globales
let model;
let tree;
const images = [];
let queryImageFeatures;

// Cargar el modelo MobileNet
async function loadModel() {
    model = await mobilenet.load();
    console.log('Modelo MobileNet cargado');
}

// Extraer características de una imagen
async function extractFeatures(img) {
    const tfImg = tf.browser.fromPixels(img).toFloat();
    const normalized = tfImg.div(tf.scalar(255));
    const batched = normalized.reshape([1, ...normalized.shape]);
    const result = await model.infer(batched, true);
    return Array.from(result.dataSync());
}

// Configurar el área de arrastrar y soltar
const dropArea = document.getElementById('dropArea');
const fileElem = document.getElementById('fileElem');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);
dropArea.addEventListener('click', () => fileElem.click());
fileElem.addEventListener('change', handleFiles);

async function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    await handleFiles(files);
}

async function handleFiles(files) {
    files = [...files];
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const img = await loadImage(file);
            images.push(img);
            displayThumbnail(img);
        }
    }
    updateTree();
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function displayThumbnail(img) {
    const thumbnail = img.cloneNode();
    thumbnail.classList.add('thumbnail');
    document.getElementById('gallery').appendChild(thumbnail);
}

async function updateTree() {
    const featuresWithImages = await Promise.all(images.map(async img => {
        const features = await extractFeatures(img);
        return { img, features };
    }));
    console.log('Características extraídas:', featuresWithImages.map(f => f.features));
    tree = new VPTree(featuresWithImages.map(f => f.features), euclideanDistance);
    console.log('Árbol construido:', tree);
    document.getElementById('searchButton').disabled = false;
}

// Manejar la imagen de consulta
const queryFile = document.getElementById('queryFile');
const queryImage = document.getElementById('queryImage');

queryFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const img = await loadImage(file);
        queryImage.src = img.src;
        queryImage.style.display = 'block';
        queryImageFeatures = await extractFeatures(img);
    }
});

// Realizar la búsqueda
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', performSearch);

async function performSearch() {
    if (!queryImageFeatures || !tree) {
        console.log("No hay características de consulta o árbol");
        return;
    }

    console.log("Características de consulta:", queryImageFeatures);
    console.log("Árbol:", tree);

    const results = tree.searchKNN(queryImageFeatures, 5);
    console.log("Resultados de búsqueda:", results);

    displayResults(results, images);
}
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    results.forEach((result, index) => {
        const { vp, dist } = result;
        // Buscar la imagen correspondiente en el array de imágenes
        const img = images.find((image, i) => {
            return euclideanDistance(vp, tree.root.vp) < 1e-10;  // Comparación con una pequeña tolerancia
        });
        
        if (img) {
            const div = document.createElement('div');
            div.classList.add('result');
            const imgElement = img.cloneNode();
            imgElement.style.maxWidth = '150px';
            imgElement.style.maxHeight = '150px';
            div.appendChild(imgElement);
            div.appendChild(document.createTextNode(`Distancia: ${dist.toFixed(4)}`));
            resultsDiv.appendChild(div);
        } else {
            console.log('No se encontró la imagen correspondiente para el resultado:', result);
        }
    });
}

// Inicializar
loadModel();