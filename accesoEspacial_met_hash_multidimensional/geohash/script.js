const PUNO_COORDS = [-15.8402, -70.0219];

const map = L.map('map').setView(PUNO_COORDS, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

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

function findNearbyRestaurants(lat, lng, radius) {
    return restaurants.filter(restaurant => {
        const distance = calculateDistance(lat, lng, restaurant.lat, restaurant.lng);
        return distance <= radius;
    });
}

let currentCircle = null;
let currentMarkers = [];

map.on('click', function(e) {
    const { lat, lng } = e.latlng;

    // Limpiar círculo y marcadores anteriores
    if (currentCircle) {
        map.removeLayer(currentCircle);
    }

    if (currentMarkers.length > 0) {
        currentMarkers.forEach(marker => map.removeLayer(marker));
        currentMarkers = [];
    }

    // Crear un nuevo círculo
    const radius = 1000;
    currentCircle = L.circle([lat, lng], { radius }).addTo(map);

    // Encontrar restaurantes cercanos dentro del radio
    const nearbyRestaurants = findNearbyRestaurants(lat, lng, radius);

    // Mostrar puntos de restaurantes cercanos
    nearbyRestaurants.forEach(restaurant => {
        const marker = L.marker([restaurant.lat, restaurant.lng]).addTo(map)
            .bindPopup(`<b>${restaurant.name}</b>`);
        currentMarkers.push(marker);
    });

    // Centrar el mapa en la ubicación clicada
    map.setView([lat, lng], 13);
});
