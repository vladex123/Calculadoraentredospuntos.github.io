class BKTree {
    constructor() {
        this.root = null;
    }

    // Function to calculate the discrete distance between two products
    distance(a, b) {
        return Math.abs(a.stock - b.stock) + Math.abs(a.reordered - b.reordered) + (a.category === b.category ? 0 : 1);
    }

    // Recursive function to add a product to the BK-Tree
    add(node, product) {
        if (!node) {
            return { product: product, children: {} };
        }

        const dist = this.distance(node.product, product);
        if (!node.children[dist]) {
            node.children[dist] = this.add(null, product);
        } else {
            this.add(node.children[dist], product);
        }

        return node;
    }

    // Recursive function to search for similar products in the BK-Tree
    search(node, product, threshold, results) {
        if (!node) return;

        const dist = this.distance(node.product, product);
        if (dist <= threshold) {
            results.push(node.product);
        }

        for (let d = Math.max(0, dist - threshold); d <= dist + threshold; d++) {
            if (node.children[d]) {
                this.search(node.children[d], product, threshold, results);
            }
        }
    }

    // Insert a product into the BK-Tree
    insert(product) {
        this.root = this.add(this.root, product);
    }

    // Find similar products within a certain distance threshold
    findSimilar(product, threshold) {
        const results = [];
        this.search(this.root, product, threshold, results);
        return results;
    }
}

const bktree = new BKTree();

// Function to add a product from the HTML form
function addProduct() {
    const name = document.getElementById('name').value;
    const stock = parseInt(document.getElementById('stock').value);
    const reordered = parseInt(document.getElementById('reordered').value);
    const category = document.getElementById('category').value;

    const product = { name, stock, reordered, category };
    bktree.insert(product);

    document.getElementById('name').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('reordered').value = '';
    document.getElementById('category').value = '';

    alert('Product added!');
}

// Function to search for similar products from the HTML form
function searchProduct() {
    const name = document.getElementById('searchName').value;
    const stock = parseInt(document.getElementById('searchStock').value);
    const reordered = parseInt(document.getElementById('searchReordered').value);
    const category = document.getElementById('searchCategory').value;
    const threshold = parseInt(document.getElementById('threshold').value);

    const product = { name, stock, reordered, category };
    const results = bktree.findSimilar(product, threshold);

    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';
    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = `Name: ${result.name}, Stock: ${result.stock}, Reordered: ${result.reordered}, Category: ${result.category}`;
        resultsList.appendChild(li);
    });
}
