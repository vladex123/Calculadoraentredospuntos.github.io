let map;
let grid;
const restaurants = [];

function initMap() {
  const puno = { lat: -15.840221, lng: -70.021881 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: puno,
  });

  grid = new Grid(-15.85, -15.83, -70.03, -70.01, 10, 10);
  
  generateRandomRestaurants();

  map.addListener("click", (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const radius = 2; // Radio en km

    const nearbyRestaurants = grid.findNearbyRestaurants(lat, lng, radius);
    const restaurantList = document.getElementById('restaurant-list');
    restaurantList.innerHTML = '';

    if (nearbyRestaurants.length > 0) {
      nearbyRestaurants.forEach(restaurant => {
        const listItem = document.createElement('li');
        listItem.textContent = restaurant.name;
        restaurantList.appendChild(listItem);
      });
    } else {
      restaurantList.innerHTML = '<li>No se encontraron restaurantes cercanos.</li>';
    }

    new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: { lat, lng },
      radius: radius * 1000, // Radio en metros
    });
  });
}

function generateRandomRestaurants() {
  const names = ["Restaurant A", "Restaurant B", "Restaurant C", "Restaurant D", "Restaurant E", "Restaurant F", "Restaurant G", "Restaurant H", "Restaurant I", "Restaurant J", "Restaurant K", "Restaurant L", "Restaurant M", "Restaurant N", "Restaurant O", "Restaurant P", "Restaurant Q", "Restaurant R", "Restaurant S", "Restaurant T"];
  
  for (let i = 0; i < names.length; i++) {
    const lat = -15.84 + (Math.random() - 0.5) * 0.02;
    const lng = -70.02 + (Math.random() - 0.5) * 0.02;
    const restaurant = { name: names[i], lat, lng };
    restaurants.push(restaurant);
    grid.insertRestaurant(restaurant);

    new google.maps.Marker({
      position: { lat, lng },
      map,
      title: names[i],
    });
  }
}

class Grid {
  constructor(minLat, maxLat, minLng, maxLng, rows, cols) {
    this.minLat = minLat;
    this.maxLat = maxLat;
    this.minLng = minLng;
    this.maxLng = maxLng;
    this.rows = rows;
    this.cols = cols;
    this.grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => []));
  }

  getCell(lat, lng) {
    const row = Math.floor(((lat - this.minLat) / (this.maxLat - this.minLat)) * this.rows);
    const col = Math.floor(((lng - this.minLng) / (this.maxLng - this.minLng)) * this.cols);
    return { row: Math.min(row, this.rows - 1), col: Math.min(col, this.cols - 1) };
  }

  insertRestaurant(restaurant) {
    const { row, col } = this.getCell(restaurant.lat, restaurant.lng);
    this.grid[row][col].push(restaurant);
  }

  findNearbyRestaurants(lat, lng, radius) {
    const { row, col } = this.getCell(lat, lng);
    const nearbyRestaurants = [];
    const rowRange = Math.ceil((radius / (this.maxLat - this.minLat)) * this.rows);
    const colRange = Math.ceil((radius / (this.maxLng - this.minLng)) * this.cols);

    for (let i = Math.max(0, row - rowRange); i <= Math.min(this.rows - 1, row + rowRange); i++) {
      for (let j = Math.max(0, col - colRange); j <= Math.min(this.cols - 1, col + colRange); j++) {
        nearbyRestaurants.push(...this.grid[i][j]);
      }
    }

    return nearbyRestaurants.filter(restaurant => this.calculateDistance(lat, lng, restaurant.lat, restaurant.lng) <= radius);
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
