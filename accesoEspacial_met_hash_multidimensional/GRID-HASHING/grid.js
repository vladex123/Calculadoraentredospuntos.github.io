class Grid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.cells = {};
    }

    _hash(x, y) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return `${cellX},${cellY}`;
    }

    insert(point, data) {
        const { lat, lng } = point;
        const cell = this._hash(lat, lng);
        if (!this.cells[cell]) {
            this.cells[cell] = [];
        }
        this.cells[cell].push(data);
    }

    queryRange(point, range) {
        const { lat, lng } = point;
        const minCellX = Math.floor((lat - range) / this.cellSize);
        const maxCellX = Math.floor((lat + range) / this.cellSize);
        const minCellY = Math.floor((lng - range) / this.cellSize);
        const maxCellY = Math.floor((lng + range) / this.cellSize);

        const result = [];
        for (let x = minCellX; x <= maxCellX; x++) {
            for (let y = minCellY; y <= maxCellY; y++) {
                const cell = `${x},${y}`;
                if (this.cells[cell]) {
                    result.push(...this.cells[cell]);
                }
            }
        }
        return result;
    }
}
