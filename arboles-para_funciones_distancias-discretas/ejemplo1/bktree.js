// bktree.js

// Función de distancia de Levenshtein
function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[a.length][b.length];
}

// Implementación del BK-Tree
class BKNode {
    constructor(word) {
        this.word = word;
        this.children = {};
    }
}

class BKTree {
    constructor(distFunc) {
        this.root = null;
        this.distFunc = distFunc;
    }

    add(word) {
        if (!this.root) {
            this.root = new BKNode(word);
        } else {
            let node = this.root;
            while (true) {
                const dist = this.distFunc(word, node.word);
                if (node.children[dist]) {
                    node = node.children[dist];
                } else {
                    node.children[dist] = new BKNode(word);
                    break;
                }
            }
        }
    }

    search(word, maxDist) {
        const results = [];
        this._searchRecursive(this.root, word, maxDist, results);
        return results;
    }

    _searchRecursive(node, word, maxDist, results) {
        if (!node) return;

        const dist = this.distFunc(word, node.word);
        if (dist <= maxDist) {
            results.push(node.word);
        }

        for (let d = dist - maxDist; d <= dist + maxDist; d++) {
            if (node.children[d]) {
                this._searchRecursive(node.children[d], word, maxDist, results);
            }
        }
    }
}
