// Implementación básica de un Trie para autocompletado

// Clase TrieNode para nodos del Trie
class TrieNode {
    constructor() {
        this.children = {};
        this.endOfWord = false;
    }
}

// Clase Trie para manejar la estructura del Trie
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // Insertar una palabra en el Trie
    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.endOfWord = true;
    }

    // Buscar todas las palabras con el prefijo dado
    search(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }
        return this.getAllWordsFromNode(node, prefix);
    }

    // Obtener todas las palabras que comienzan desde el nodo dado
    getAllWordsFromNode(node, prefix) {
        let results = [];
        if (node.endOfWord) {
            results.push(prefix);
        }
        for (let char in node.children) {
            results = results.concat(this.getAllWordsFromNode(node.children[char], prefix + char));
        }
        return results;
    }
}

// Ejemplo de uso
let trie = new Trie();
let words = ["apple", "application", "apartment", "bat", "ball", "cat", "car"];
words.forEach(word => trie.insert(word.toLowerCase()));

function handleInput() {
    let input = document.getElementById('input').value.toLowerCase().trim();
    let autocompleteItems = document.getElementById('autocomplete-items');

    // Limpiar sugerencias anteriores
    autocompleteItems.innerHTML = '';

    // Obtener palabras con el prefijo actual
    let suggestions = trie.search(input);

    // Mostrar las sugerencias
    suggestions.forEach(word => {
        let suggestionElement = document.createElement('div');
        suggestionElement.textContent = word;
        suggestionElement.addEventListener('click', () => {
            document.getElementById('input').value = word;
            autocompleteItems.innerHTML = ''; // Limpiar sugerencias después de seleccionar una
        });
        autocompleteItems.appendChild(suggestionElement);
    });
}
