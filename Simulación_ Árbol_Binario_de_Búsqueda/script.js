class Node {
    constructor(word) {
        this.word = word;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(word) {
        const steps = [];
        this.root = this._insertRecursive(this.root, word, steps);
        return steps;
    }

    _insertRecursive(node, word, steps) {
        if (node === null) {
            steps.push(`Insertando "${word}" en un nodo vacío.`);
            return new Node(word);
        }

        if (word < node.word) {
            steps.push(`"${word}" es menor que "${node.word}", yendo a la izquierda.`);
            node.left = this._insertRecursive(node.left, word, steps);
        } else if (word > node.word) {
            steps.push(`"${word}" es mayor que "${node.word}", yendo a la derecha.`);
            node.right = this._insertRecursive(node.right, word, steps);
        } else {
            steps.push(`"${word}" ya existe en el árbol.`);
        }

        return node;
    }

    search(word) {
        return this._searchRecursive(this.root, word);
    }

    _searchRecursive(node, word) {
        if (node === null || node.word === word) {
            return node;
        }

        if (word < node.word) {
            return this._searchRecursive(node.left, word);
        }

        return this._searchRecursive(node.right, word);
    }

    delete(word) {
        this.root = this._deleteRecursive(this.root, word);
        updateTreeVisualization();
    }

    _deleteRecursive(node, word) {
        if (node === null) {
            return null;
        }

        if (word < node.word) {
            node.left = this._deleteRecursive(node.left, word);
        } else if (word > node.word) {
            node.right = this._deleteRecursive(node.right, word);
        } else {
            if (node.left === null && node.right === null) {
                return null;
            }
            if (node.left === null) {
                return node.right;
            }
            if (node.right === null) {
                return node.left;
            }
            let minNode = this._findMinNode(node.right);
            node.word = minNode.word;
            node.right = this._deleteRecursive(node.right, minNode.word);
        }

        return node;
    }

    _findMinNode(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    findMin() {
        let current = this.root;
        while (current && current.left !== null) {
            current = current.left;
        }
        return current ? current.word : null;
    }

    findMax() {
        let current = this.root;
        while (current && current.right !== null) {
            current = current.right;
        }
        return current ? current.word : null;
    }

    countNodes() {
        function count(node) {
            if (node === null) return 0;
            return 1 + count(node.left) + count(node.right);
        }
        return count(this.root);
    }
}

const bst = new BST();
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

function updateTreeVisualization(highlightedNodes = []) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bst.root) {
        drawTree(bst.root, canvas.width / 2, 30, canvas.width / 4, highlightedNodes);
    }
}

function drawTree(node, x, y, horizontalSpacing, highlightedNodes) {
    if (!node) return;

    ctx.fillStyle = highlightedNodes.includes(node) ? '#e74c3c' : '#3498db';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '12px Roboto';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.word, x, y);

    if (node.left) {
        ctx.strokeStyle = '#34495e';
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x - horizontalSpacing, y + 60);
        ctx.stroke();
        drawTree(node.left, x - horizontalSpacing, y + 60, horizontalSpacing / 2, highlightedNodes);
    }
    if (node.right) {
        ctx.strokeStyle = '#34495e';
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x + horizontalSpacing, y + 60);
        ctx.stroke();
        drawTree(node.right, x + horizontalSpacing, y + 60, horizontalSpacing / 2, highlightedNodes);
    }
}

function showResult(message) {
    document.getElementById('result').textContent = message;
}

function showExplanation(message) {
    const explanationBox = document.getElementById('explanationBox');
    explanationBox.textContent = message;
    explanationBox.style.display = 'block';
}

function clearInput() {
    document.getElementById('wordInput').value = '';
}

document.getElementById('insertBtn').addEventListener('click', () => {
    const word = document.getElementById('wordInput').value.trim();
    if (word) {
        const steps = bst.insert(word);
        showInsertionSteps(steps, word);
    }
});

function showInsertionSteps(steps, word) {
    let i = 0;
    function showStep() {
        if (i < steps.length) {
            showExplanation(steps[i]);
            i++;
            setTimeout(showStep, 1000);
        } else {
            updateTreeVisualization();
            showResult(`Palabra "${word}" insertada.`);
            showExplanation('Inserción completada.');
            clearInput();
        }
    }
    showStep();
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const word = document.getElementById('wordInput').value.trim();
    if (word) {
        animateSearch(word);
    }
});

document.getElementById('deleteBtn').addEventListener('click', () => {
    const word = document.getElementById('wordInput').value.trim();
    if (word) {
        const nodeExists = bst.search(word);
        if (nodeExists) {
            bst.delete(word);
            updateTreeVisualization();
            showResult(`Palabra "${word}" eliminada.`);
            showExplanation('');
        } else {
            showResult(`Palabra "${word}" no encontrada.`);
            showExplanation('No se puede eliminar una palabra que no existe en el árbol.');
        }
        clearInput();
    }
});

function animateSearch(word) {
    let currentNode = bst.root;
    let path = [];

    function step() {
        if (!currentNode) {
            showResult(`Palabra "${word}" no encontrada.`);
            showExplanation('La palabra no existe en el árbol.');
            updateTreeVisualization(path);
            return;
        }

        path.push(currentNode);
        updateTreeVisualization(path);

        if (word === currentNode.word) {
            showResult(`Palabra "${word}" encontrada.`);
            showExplanation('La palabra existe en el árbol.');
        } else if (word < currentNode.word) {
            showExplanation(`"${word}" es menor que "${currentNode.word}", buscando a la izquierda.`);
            currentNode = currentNode.left;
            setTimeout(step, 1000);
        } else {
            showExplanation(`"${word}" es mayor que "${currentNode.word}", buscando a la derecha.`);
            currentNode = currentNode.right;
            setTimeout(step, 1000);
        }
    }

    step();
}

document.getElementById('inorderBtn').addEventListener('click', () => {
    const result = inorderTraversal(bst.root);
    showResult(`Recorrido inorden: ${result.join(', ')}`);
});

document.getElementById('preorderBtn').addEventListener('click', () => {
    const result = preorderTraversal(bst.root);
    showResult(`Recorrido preorden: ${result.join(', ')}`);
});

document.getElementById('postorderBtn').addEventListener('click', () => {
    const result = postorderTraversal(bst.root);
    showResult(`Recorrido postorden: ${result.join(', ')}`);
});

function inorderTraversal(node) {
    const result = [];
    function traverse(n) {
        if (n) {
            traverse(n.left);
            result.push(n.word);
            traverse(n.right);
        }
    }
    traverse(node);
    return result;
}

function preorderTraversal(node) {
    const result = [];
    function traverse(n) {
        if (n) {
            result.push(n.word);
            traverse(n.left);
            traverse(n.right);
        }
    }
    traverse(node);
    return result;
}

function postorderTraversal(node) {
    const result = [];
    function traverse(n) {
        if (n) {
            traverse(n.left);
            traverse(n.right);
            result.push(n.word);
        }
    }
    traverse(node);
    return result;
}

document.getElementById('minMaxBtn').addEventListener('click', () => {
    const min = bst.findMin();
    const max = bst.findMax();
    showResult(`Mínimo: ${min || 'N/A'}, Máximo: ${max || 'N/A'}`);
});

document.getElementById('countBtn').addEventListener('click', () => {
    const count = bst.countNodes();
    showResult(`Número total de nodos: ${count}`);
});

window.addEventListener('resize', updateTreeVisualization);
updateTreeVisualization();