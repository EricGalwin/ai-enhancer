const imageUpload = document.getElementById('imageUpload');
const originalCanvas = document.getElementById('originalCanvas');
const enhancedCanvas = document.getElementById('enhancedCanvas');
const ctxOriginal = originalCanvas.getContext('2d');
const ctxEnhanced = enhancedCanvas.getContext('2d');

const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hue = document.getElementById('hue');
const blur = document.getElementById('blur');
const noise = document.getElementById('noise');
const filter = document.getElementById('filter');
const autoEnhance = document.getElementById('autoEnhance');
const downloadBtn = document.getElementById('download');

let img = new Image();
let imgLoaded = false;

// Upload & Display Image
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

img.onload = function () {
    originalCanvas.width = enhancedCanvas.width = img.width / 2;
    originalCanvas.height = enhancedCanvas.height = img.height / 2;
    ctxOriginal.drawImage(img, 0, 0, originalCanvas.width, originalCanvas.height);
    ctxEnhanced.drawImage(img, 0, 0, enhancedCanvas.width, enhancedCanvas.height);
    imgLoaded = true;
};

// Apply Filters
function applyFilters() {
    if (!imgLoaded) return;

    ctxEnhanced.clearRect(0, 0, enhancedCanvas.width, enhancedCanvas.height);
    
    // Set filter values
    ctxEnhanced.filter = `
        brightness(${brightness.value}%)
        contrast(${contrast.value}%)
        saturate(${saturation.value}%)
        hue-rotate(${hue.value}deg)
        blur(${blur.value}px)
    `;

    ctxEnhanced.drawImage(img, 0, 0, enhancedCanvas.width, enhancedCanvas.height);

    addNoiseEffect();
    applyFilterEffect();
}

// Noise Reduction Effect
function addNoiseEffect() {
    const imageData = ctxEnhanced.getImageData(0, 0, enhancedCanvas.width, enhancedCanvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        let noiseValue = (Math.random() - 0.5) * noise.value;
        pixels[i] += noiseValue;
        pixels[i + 1] += noiseValue;
        pixels[i + 2] += noiseValue;
    }
    ctxEnhanced.putImageData(imageData, 0, 0);
}

// Apply Filter Effect
function applyFilterEffect() {
    if (filter.value === "grayscale") ctxEnhanced.filter += " grayscale(100%)";
    if (filter.value === "sepia") ctxEnhanced.filter += " sepia(100%)";
    if (filter.value === "vintage") ctxEnhanced.filter += " sepia(60%) contrast(90%)";
}

// AI Auto Enhancement (Simulated)
autoEnhance.addEventListener('click', () => {
    brightness.value = 120;
    contrast.value = 130;
    saturation.value = 110;
    hue.value = 0;
    blur.value = 0;
    noise.value = 10;
    filter.value = "none";
    applyFilters();
});

// Event Listeners for Filters
[brightness, contrast, saturation, hue, blur, noise, filter].forEach(control => {
    control.addEventListener('input', applyFilters);
});

// Download Image
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'enhanced-image.png';
    link.href = enhancedCanvas.toDataURL();
    link.click();
});



