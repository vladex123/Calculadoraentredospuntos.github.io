class VPTree {
    constructor(points = [], distanceFunction = (a, b) => Math.sqrt(a.reduce((sum, _, i) => sum + (a[i] - b[i]) ** 2, 0))) {
        this.root = this.buildTree(points);
        this.distanceFunction = distanceFunction;
    }

    buildTree(points) {
        if (points.length === 0) return null;
        if (points.length === 1) return { point: points[0], radius: 0, inner: null, outer: null };

        const vantagePoint = points[0];
        const distances = points.slice(1).map(point => ({ point, distance: this.distanceFunction(vantagePoint, point) }));

        distances.sort((a, b) => a.distance - b.distance);
        const medianIndex = Math.floor(distances.length / 2);
        const radius = distances[medianIndex].distance;

        return {
            point: vantagePoint,
            radius,
            inner: this.buildTree(distances.slice(0, medianIndex).map(({ point }) => point)),
            outer: this.buildTree(distances.slice(medianIndex).map(({ point }) => point)),
        };
    }

    search(point, threshold) {
        const results = [];
        this._search(this.root, point, threshold, results);
        return results;
    }

    _search(node, point, threshold, results) {
        if (!node) return;

        const distance = this.distanceFunction(node.point, point);
        if (distance <= threshold) results.push({ point: node.point, distance });

        if (distance - threshold <= node.radius) this._search(node.inner, point, threshold, results);
        if (distance + threshold >= node.radius) this._search(node.outer, point, threshold, results);
    }
}

class MusicRecommender {
    constructor(distanceFunction) {
        this.songs = [];
        this.vpTree = null;
        this.distanceFunction = distanceFunction || ((a, b) => Math.sqrt(a.reduce((sum, _, i) => sum + (a[i] - b[i]) ** 2, 0)));
    }

    addSong(id, features) {
        this.songs.push({ id, features });
        this.vpTree = new VPTree(this.songs.map(song => song.features), this.distanceFunction);
    }

    recommendSongs(features, threshold) {
        if (!this.vpTree) return [];

        const similarSongs = this.vpTree.search(features, threshold);
        return similarSongs.map(result => ({
            id: this.songs.find(song => song.features === result.point).id,
            distance: result.distance,
        }));
    }
}

const recommender = new MusicRecommender();
let songId = 1;

function addSong() {
    const tempo = parseFloat(document.getElementById('tempo').value);
    const pitch = parseFloat(document.getElementById('pitch').value);
    const duration = parseFloat(document.getElementById('duration').value);

    if (isNaN(tempo) || isNaN(pitch) || isNaN(duration)) {
        alert('Please enter valid numbers for tempo, pitch, and duration.');
        return;
    }

    recommender.addSong(songId++, [tempo, pitch, duration]);
    alert('Song added successfully!');
}

function recommendSongs() {
    const tempo = parseFloat(document.getElementById('tempo').value);
    const pitch = parseFloat(document.getElementById('pitch').value);
    const duration = parseFloat(document.getElementById('duration').value);

    if (isNaN(tempo) || isNaN(pitch) || isNaN(duration)) {
        alert('Please enter valid numbers for tempo, pitch, and duration.');
        return;
    }

    const threshold = 20; // Example threshold value
    const recommendations = recommender.recommendSongs([tempo, pitch, duration], threshold);

    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '<h2>Recommended Songs:</h2>';
    recommendations.forEach(rec => {
        recommendationsDiv.innerHTML += `<p>Song ID: ${rec.id}, Distance: ${rec.distance.toFixed(2)}</p>`;
    });

    if (recommendations.length === 0) {
        recommendationsDiv.innerHTML += '<p>No similar songs found.</p>';
    }
}
