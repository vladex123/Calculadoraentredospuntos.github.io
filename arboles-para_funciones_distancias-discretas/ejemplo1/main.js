// main.js

// Crear BK-Tree y añadir nombres
const bktree = new BKTree(levenshteinDistance);
const nombres = ["juan", "juanita", "john", "juana", "jana", "juam", "jose", "julia", "judith", "javier"];
nombres.forEach(nombre => bktree.add(nombre));

// Función para encontrar sugerencias
function findSuggestions() {
    const nameInput = document.getElementById('nameInput').value;
    const maxDistance = 2; // Máxima distancia de Levenshtein permitida
    const suggestions = bktree.search(nameInput, maxDistance);
    displaySuggestions(suggestions);
}

// Función para mostrar sugerencias
function displaySuggestions(suggestions) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';
    if (suggestions.length === 0) {
        suggestionsDiv.textContent = 'No se encontraron sugerencias.';
    } else {
        const list = document.createElement('ul');
        suggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion;
            list.appendChild(listItem);
        });
        suggestionsDiv.appendChild(list);
    }
}
