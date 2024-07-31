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
        this.root = this._insertRecursive(this.root, word);
    }

    _insertRecursive(node, word) {
        if (node === null) {
            return new Node(word);
        }

        if (word < node.word) {
            node.left = this._insertRecursive(node.left, word);
        } else if (word > node.word) {
            node.right = this._insertRecursive(node.right, word);
        }

        return node;
    }

    search(word, callback) {
        return this._searchRecursive(this.root, word, callback);
    }

    _searchRecursive(node, word, callback) {
        if (node === null) {
            callback(null, false);
            return null;
        }

        callback(node, false);

        if (word === node.word) {
            callback(node, true);
            return node;
        }

        if (word < node.word) {
            return this._searchRecursive(node.left, word, callback);
        }

        return this._searchRecursive(node.right, word, callback);
    }

    delete(word) {
        this.root = this._deleteRecursive(this.root, word);
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
            if (node.left === null) {
                return node.right;
            } else if (node.right === null) {
                return node.left;
            }

            node.word = this._minValue(node.right);
            node.right = this._deleteRecursive(node.right, node.word);
        }

        return node;
    }

    _minValue(node) {
        let minv = node.word;
        while (node.left !== null) {
            minv = node.left.word;
            node = node.left;
        }
        return minv;
    }

    inorder() {
        const result = [];
        this._inorderRecursive(this.root, result);
        return result;
    }

    _inorderRecursive(node, result) {
        if (node !== null) {
            this._inorderRecursive(node.left, result);
            result.push(node.word);
            this._inorderRecursive(node.right, result);
        }
    }

    findMin() {
        if (!this.root) return null;
        let current = this.root;
        while (current.left !== null) {
            current = current.left;
        }
        return current.word;
    }

    findMax() {
        if (!this.root) return null;
        let current = this.root;
        while (current.right !== null) {
            current = current.right;
        }
        return current.word;
    }

    countNodes() {
        return this._countNodesRecursive(this.root);
    }

    _countNodesRecursive(node) {
        if (node === null) {
            return 0;
        }
        return 1 + this._countNodesRecursive(node.left) + this._countNodesRecursive(node.right);
    }
}

const bst = new BST();
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

function insertWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim().toLowerCase();
    if (word) {
        bst.insert(word);
        wordInput.value = '';
        updateTreeVisualization();
        showResult(`La palabra "${word}" ha sido insertada.`);
    }
}

function searchWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim().toLowerCase();
    if (word) {
        let steps = [];
        bst.search(word, (node, found) => {
            if (node) {
                steps.push({ word: node.word, found: found });
            }
        });
        animateSearch(steps);
    }
}

function animateSearch(steps) {
    let i = 0;
    function animate() {
        if (i < steps.length) {
            highlightNode(steps[i].word, steps[i].found);
            showResult(`Buscando: comparando con "${steps[i].word}"`);
            i++;
            setTimeout(animate, 1000);
        } else {
            const lastStep = steps[steps.length - 1];
            if (lastStep.found) {
                showResult(`La palabra "${lastStep.word}" fue encontrada.`);
            } else {
                showResult(`La palabra no está en el árbol.`);
            }
        }
    }
    animate();
}

function highlightNode(word, found) {
    updateTreeVisualization((node) => {
        if (node.word === word) {
            return found ? 'green' : 'yellow';
        }
        return 'white';
    });
}

function deleteWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim().toLowerCase();
    if (word) {
        bst.delete(word);
        updateTreeVisualization();
        showResult(`La palabra "${word}" ha sido eliminada (si existía).`);
    }
}

function showInorder() {
    const inorderList = bst.inorder();
    showResult(`Recorrido inorden: ${inorderList.join(', ')}`);
}

function showMinMax() {
    const min = bst.findMin();
    const max = bst.findMax();
    showResult(`Palabra mínima: ${min || 'N/A'}, Palabra máxima: ${max || 'N/A'}`);
}

function showNodeCount() {
    const count = bst.countNodes();
    showResult(`Número total de nodos: ${count}`);
}

function showResult(message) {
    document.getElementById('result').textContent = message;
}

function updateTreeVisualization(highlightCallback = () => 'white') {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bst.root) {
        const nodeCount = bst.countNodes();
        const levels = Math.ceil(Math.log2(nodeCount + 1));
        const verticalSpacing = canvas.height / (levels + 1);
        drawTree(bst.root, canvas.width / 2, verticalSpacing, canvas.width / 2, verticalSpacing, highlightCallback);
    }
}

function drawTree(node, x, y, horizontalSpacing, verticalSpacing, highlightCallback) {
    if (!node) return;

    ctx.fillStyle = highlightCallback(node);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, 40, 25, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.word, x, y);

    const nextHorizontalSpacing = horizontalSpacing / 2;
    const leftX = x - nextHorizontalSpacing;
    const rightX = x + nextHorizontalSpacing;
    const nextY = y + verticalSpacing;

    if (node.left) {
        ctx.beginPath();
        ctx.moveTo(x - 30, y + 20);
        ctx.lineTo(leftX + 30, nextY - 20);
        ctx.stroke();
        drawTree(node.left, leftX, nextY, nextHorizontalSpacing, verticalSpacing, highlightCallback);
    }

    if (node.right) {
        ctx.beginPath();
        ctx.moveTo(x + 30, y + 20);
        ctx.lineTo(rightX - 30, nextY - 20);
        ctx.stroke();
        drawTree(node.right, rightX, nextY, nextHorizontalSpacing, verticalSpacing, highlightCallback);
    }
}

window.addEventListener('resize', updateTreeVisualization);
updateTreeVisualization();