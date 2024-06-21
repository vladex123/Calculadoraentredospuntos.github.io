let originalCanvas = document.getElementById('originalCanvas');
let reconstructedCanvas = document.getElementById('reconstructedCanvas');
let ctxOriginal = originalCanvas.getContext('2d');
let ctxReconstructed = reconstructedCanvas.getContext('2d');
let thresholdSlider = document.getElementById('threshold');
let thresholdValue = document.getElementById('thresholdValue');
let mseValue = document.getElementById('mseValue');

let originalImageData;
let reconstructedImage;

// Función para cargar la imagen y mostrar en el canvas original
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
            originalImageData = ctxOriginal.getImageData(0, 0, img.width, img.height);
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(input.files[0]);
}

// Función para reconstruir la imagen utilizando Quad Tree y comprimir
function reconstructImage() {
    let threshold = parseInt(thresholdSlider.value);
    thresholdValue.textContent = threshold;
    
    // Copiar la imagen original para modificarla
    reconstructedImage = ctxOriginal.getImageData(0, 0, originalCanvas.width, originalCanvas.height);

    // Llamar a la función para construir el Quad Tree y reconstruir la imagen
    let quadTreeRoot = buildQuadTree(0, 0, originalImageData.width, originalImageData.height, threshold);
    
    // Mostrar la imagen reconstruida en el canvas correspondiente
    ctxReconstructed.putImageData(reconstructedImage, 0, 0);

    // Calcular y mostrar el MSE (Mean Squared Error)
    let mse = calculateMSE(originalImageData, reconstructedImage);
    mseValue.textContent = mse.toFixed(2);

    // Mostrar botón para guardar imagen reconstruida
    document.getElementById('saveButton').style.display = 'block';
}

// Función para construir el Quad Tree recursivamente y retornar el nodo raíz
function buildQuadTree(x, y, width, height, threshold) {
    let node = {
        x: x,
        y: y,
        width: width,
        height: height,
        isLeaf: true,
        pixelValue: getPixel(originalImageData, x, y),
        children: []
    };

    let homogeneous = true;
    let pixelValue = node.pixelValue;

    // Verificar si todos los píxeles en el área son homogéneos
    for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
            if (Math.abs(getPixel(originalImageData, i, j) - pixelValue) > threshold) {
                homogeneous = false;
                break;
            }
        }
        if (!homogeneous) {
            break;
        }
    }

    // Si el área no es homogénea, dividirla en cuatro cuadrantes y continuar recursivamente
    if (!homogeneous) {
        node.isLeaf = false;
        let halfWidth = Math.floor(width / 2);
        let halfHeight = Math.floor(height / 2);
        node.children.push(buildQuadTree(x, y, halfWidth, halfHeight, threshold));
        node.children.push(buildQuadTree(x + halfWidth, y, halfWidth, halfHeight, threshold));
        node.children.push(buildQuadTree(x, y + halfHeight, halfWidth, halfHeight, threshold));
        node.children.push(buildQuadTree(x + halfWidth, y + halfHeight, halfWidth, halfHeight, threshold));
    }

    return node;
}

// Función para guardar la imagen reconstruida como PNG
function saveReconstructed() {
    let link = document.createElement('a');
    link.download = 'reconstructed_image.png';
    reconstructedCanvas.toBlob(function(blob) {
        link.href = URL.createObjectURL(blob);
        link.click();
    }, 'image/png');
}

// Función para calcular el Mean Squared Error (MSE)
function calculateMSE(original, reconstructed) {
    let sumSquaredError = 0;
    for (let i = 0; i < original.data.length; i += 4) {
        let error = original.data[i] - reconstructed.data[i];
        sumSquaredError += error * error;
    }
    return sumSquaredError / (original.data.length / 4);
}

// Función auxiliar para obtener el valor de un píxel en la imagen
function getPixel(imageData, x, y) {
    let index = (y * imageData.width + x) * 4;
    return (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
}

// Event listener para cargar la imagen
document.getElementById('imageInput').addEventListener('change', loadImage);

// Event listener para el slider de umbral
thresholdSlider.addEventListener('input', reconstructImage);
