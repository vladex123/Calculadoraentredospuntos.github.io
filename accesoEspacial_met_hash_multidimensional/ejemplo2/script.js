// Definir la coordenada inicial de Puno
const PUNO_COORDS = [-15.8402, -70.0219];

// Crear el mapa
const map = L.map('map').setView(PUNO_COORDS, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Datos de 20 restaurantes (ejemplo)
const restaurants = [
    { name: "Restaurante A", lat: -15.8381, lng: -70.0208 },
    { name: "Restaurante B", lat: -15.8399, lng: -70.0222 },
    { name: "Restaurante C", lat: -15.8423, lng: -70.0245 },
    { name: "Restaurante D", lat: -15.8450, lng: -70.0250 },
    { name: "Restaurante E", lat: -15.8475, lng: -70.0280 },
    { name: "Restaurante F", lat: -15.8500, lng: -70.0300 },
    { name: "Restaurante G", lat: -15.8350, lng: -70.0150 },
    { name: "Restaurante H", lat: -15.8300, lng: -70.0100 },
    { name: "Restaurante I", lat: -15.8450, lng: -70.0350 },
    { name: "Restaurante J", lat: -15.8420, lng: -70.0400 },
    { name: "Restaurante K", lat: -15.8490, lng: -70.0410 },
    { name: "Restaurante L", lat: -15.8380, lng: -70.0200 },
    { name: "Restaurante M", lat: -15.8330, lng: -70.0170 },
    { name: "Restaurante N", lat: -15.8400, lng: -70.0150 },
    { name: "Restaurante O", lat: -15.8425, lng: -70.0125 },
    { name: "Restaurante P", lat: -15.8455, lng: -70.0255 },
    { name: "Restaurante Q", lat: -15.8470, lng: -70.0285 },
    { name: "Restaurante R", lat: -15.8485, lng: -70.0310 },
    { name: "Restaurante S", lat: -15.8355, lng: -70.0155 },
    { name: "Restaurante T", lat: -15.8320, lng: -70.0110 }
];

// Agregar los restaurantes al mapa
restaurants.forEach(restaurant => {
    L.marker([restaurant.lat, restaurant.lng]).addTo(map)
        .bindPopup(`<b>${restaurant.name}</b>`);
});

// Función para calcular la distancia (fórmula de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // en metros
}

// Agregar evento de clic en el mapa
map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    L.marker([lat, lng]).addTo(map).bindPopup('Ubicación seleccionada').openPopup();

    // Dibujar un círculo con radio de 1 km
    const radius = 1000;
    L.circle([lat, lng], { radius }).addTo(map);

    // Buscar restaurantes dentro del radio
    const nearbyRestaurants = restaurants.filter(restaurant => {
        const distance = calculateDistance(lat, lng, restaurant.lat, restaurant.lng);
        return distance <= radius;
    });

    // Mostrar los restaurantes cercanos
    nearbyRestaurants.forEach(restaurant => {
        L.marker([restaurant.lat, restaurant.lng]).addTo(map)
          .bindPopup(`<b>${restaurant.name}</b>`)
          .openPopup();
    });
});
