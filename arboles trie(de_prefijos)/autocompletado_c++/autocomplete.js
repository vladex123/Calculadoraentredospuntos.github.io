// Palabras reservadas y funciones de C++ para autocompletado
const cppKeywords = [
    'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor', 'bool', 'break',
    'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept',
    'const', 'consteval', 'constexpr', 'const_cast', 'continue', 'co_await', 'co_return', 'co_yield',
    'decltype', 'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit',
    'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int',
    'long', 'mutable', 'namespace', 'new', 'noexcept', 'not', 'not_eq', 'nullptr', 'operator',
    'or', 'or_eq', 'private', 'protected', 'public', 'reflexpr', 'register', 'reinterpret_cast',
    'requires', 'return', 'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast',
    'struct', 'switch', 'synchronized', 'template', 'this', 'thread_local', 'throw', 'true', 'try',
    'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile',
    'wchar_t', 'while', 'xor', 'xor_eq'
];

// Elementos del DOM
const codeEditor = document.getElementById('code-editor');
const codeOutput = document.getElementById('code-output');
const autocompleteItems = document.getElementById('autocomplete-items');

// Configurar el fondo del editor en negro
codeEditor.style.backgroundColor = '#2d2d2d'; // Color de fondo oscuro para el editor

// Función para manejar la entrada en el editor
function handleInput() {
    let code = codeEditor.value.trim();

    // Actualizar la vista previa del código
    updatePreview(code);

    // Mostrar sugerencias de autocompletado
    showAutocompleteSuggestions(code);
}

// Actualizar la vista previa del código C++ generado
function updatePreview(code) {
    codeOutput.innerHTML = '';

    try {
        codeOutput.innerHTML = Prism.highlight(code, Prism.languages.cpp, 'cpp');
    } catch (error) {
        console.error(error);
        codeOutput.textContent = 'Error de sintaxis en el código C++';
    }
}

// Mostrar sugerencias de autocompletado
function showAutocompleteSuggestions(code) {
    let lastWord = getLastWord(code);
    let suggestions = cppKeywords.filter(keyword => keyword.startsWith(lastWord));

    autocompleteItems.innerHTML = '';

    suggestions.forEach(word => {
        let suggestionElement = document.createElement('div');
        suggestionElement.textContent = word;
        suggestionElement.addEventListener('click', () => {
            insertSuggestion(word);
        });
        autocompleteItems.appendChild(suggestionElement);
    });

    if (suggestions.length > 0) {
        autocompleteItems.style.display = 'block';
    } else {
        autocompleteItems.style.display = 'none';
    }
}

// Insertar la sugerencia seleccionada en el editor
function insertSuggestion(suggestion) {
    let code = codeEditor.value.trim();
    let lastWord = getLastWord(code);
    let newCode = code.slice(0, code.length - lastWord.length) + suggestion;
    codeEditor.value = newCode;
    autocompleteItems.style.display = 'none';
    handleInput(); // Actualizar la vista previa después de insertar la sugerencia
}

// Obtener la última palabra del texto ingresado
function getLastWord(text) {
    let words = text.split(/\s+/);
    return words[words.length - 1];
}

// Event listener para cambios en el editor
codeEditor.addEventListener('input', handleInput);

// Mostrar la vista previa inicialmente
updatePreview(codeEditor.value.trim());
