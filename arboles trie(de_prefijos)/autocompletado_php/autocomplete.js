// Palabras reservadas y funciones de PHP para autocompletado
const phpKeywords = [
    'abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch', 'class', 'clone',
    'const', 'continue', 'declare', 'default', 'die', 'do', 'echo', 'else', 'elseif', 'empty',
    'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch', 'endwhile', 'eval', 'exit',
    'extends', 'final', 'finally', 'for', 'foreach', 'function', 'global', 'goto', 'if', 'implements',
    'include', 'include_once', 'instanceof', 'insteadof', 'interface', 'isset', 'list', 'namespace',
    'new', 'or', 'print', 'private', 'protected', 'public', 'require', 'require_once', 'return',
    'static', 'switch', 'throw', 'trait', 'try', 'unset', 'use', 'var', 'while', 'xor', 'yield'
];

// Elementos del DOM
const codeEditor = document.getElementById('code-editor');
const autocompleteItems = document.getElementById('autocomplete-items');
const codeOutput = document.getElementById('code-output');

// Función para manejar la entrada en el editor
function handleInput() {
    let input = codeEditor.value.trim();
    let lastWord = getLastWord(input);

    // Limpiar sugerencias anteriores
    autocompleteItems.innerHTML = '';
    
    // Filtrar palabras reservadas que coincidan con el último texto escrito
    let suggestions = phpKeywords.filter(keyword => keyword.startsWith(lastWord));

    // Mostrar las sugerencias si hay coincidencias
    if (suggestions.length > 0) {
        suggestions.forEach(word => {
            let suggestionElement = document.createElement('div');
            suggestionElement.textContent = word;
            suggestionElement.addEventListener('click', () => {
                insertSuggestion(word);
            });
            autocompleteItems.appendChild(suggestionElement);
        });
        autocompleteItems.style.display = 'block';
    } else {
        autocompleteItems.style.display = 'none';
    }

    // Actualizar la vista previa del código
    updatePreview();
}

// Obtener la última palabra del texto ingresado
function getLastWord(text) {
    let words = text.split(/\s+/);
    return words[words.length - 1];
}

// Insertar la sugerencia seleccionada en el editor
function insertSuggestion(suggestion) {
    let input = codeEditor.value.trim();
    let lastWord = getLastWord(input);
    let newText = input.slice(0, input.length - lastWord.length) + suggestion;
    codeEditor.value = newText;
    autocompleteItems.style.display = 'none';
    updatePreview();
}

// Actualizar la vista previa del código PHP generado
function updatePreview() {
    let code = codeEditor.value.trim();
    codeOutput.innerHTML = '';

    try {
        let highlightedCode = Prism.highlight(code, Prism.languages.php, 'php');
        codeOutput.innerHTML = `<pre><code class="language-php">${highlightedCode}</code></pre>`;
    } catch (error) {
        console.error(error);
        codeOutput.textContent = 'Error de sintaxis en el código PHP';
    }
}

// Event listeners
codeEditor.addEventListener('input', handleInput);

// Mostrar la vista previa inicialmente
updatePreview();
