// Variables globales
let originalImage;
let reconstructedImage;
let originalCanvas = document.getElementById('originalCanvas');
let reconstructedCanvas = document.getElementById('reconstructedCanvas');
let thresholdSlider = document.getElementById('threshold');
let thresholdValue = document.getElementById('thresholdValue');
let ctxOriginal = originalCanvas.getContext('2d');
let ctxReconstructed = reconstructedCanvas.getContext('2d');

// Función para cargar la imagen
function loadImage(event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function(){
        let img = new Image();
        img.onload = function(){
            originalCanvas.width = img.width;
            originalCanvas.height = img.height;
            reconstructedCanvas.width = img.width;
            reconstructedCanvas.height = img.height;
            ctxOriginal.drawImage(img, 0, 0);
            originalImage = ctxOriginal.getImageData(0, 0, img.width, img.height);
            reconstructImage(); // Reconstruir imagen inicialmente
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(input.files[0]);
}

// Función para reconstruir la imagen utilizando Quad Tree
function reconstructImage() {
    let threshold = parseInt(thresholdSlider.value);
    thresholdValue.textContent = threshold;
    
    // Copiar la imagen original para modificarla
    reconstructedImage = ctxOriginal.getImageData(0, 0, originalCanvas.width, originalCanvas.height);

    // Llamar a la función para construir el Quad Tree y reconstruir la imagen
    buildQuadTree(0, 0, originalImage.width, originalImage.height, threshold);
    
    // Mostrar la imagen reconstruida en el canvas correspondiente
    ctxReconstructed.putImageData(reconstructedImage, 0, 0);
}

// Función para construir el Quad Tree recursivamente
function buildQuadTree(x, y, width, height, threshold) {
    let homogeneous = true;
    let pixelValue = getPixel(originalImage, x, y);

    // Verificar si todos los píxeles en el área son homogéneos
    for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
            if (Math.abs(getPixel(originalImage, i, j) - pixelValue) > threshold) {
                homogeneous = false;
                break;
            }
        }
        if (!homogeneous) {
            break;
        }
    }

    // Si el área es homogénea, colorearla con el color promedio
    if (homogeneous) {
        let avgColor = Math.round(pixelValue);
        for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
                setPixel(reconstructedImage, i, j, avgColor);
            }
        }
    } else {
        // Dividir el área en cuatro cuadrantes y llamar recursivamente
        let halfWidth = Math.floor(width / 2);
        let halfHeight = Math.floor(height / 2);
        buildQuadTree(x, y, halfWidth, halfHeight, threshold);
        buildQuadTree(x + halfWidth, y, halfWidth, halfHeight, threshold);
        buildQuadTree(x, y + halfHeight, halfWidth, halfHeight, threshold);
        buildQuadTree(x + halfWidth, y + halfHeight, halfWidth, halfHeight, threshold);
    }
}

// Función auxiliar para obtener el valor de un píxel en la imagen
function getPixel(imageData, x, y) {
    let index = (y * imageData.width + x) * 4;
    return (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
}

// Función auxiliar para establecer el valor de un píxel en la imagen
function setPixel(imageData, x, y, value) {
    let index = (y * imageData.width + x) * 4;
    imageData.data[index] = value;
    imageData.data[index + 1] = value;
    imageData.data[index + 2] = value;
    imageData.data[index + 3] = 255; // Alpha channel
}

// Event listener para cargar la imagen
document.getElementById('imageInput').addEventListener('change', loadImage);

// Event listener para el slider de umbral
thresholdSlider.addEventListener('input', reconstructImage);
