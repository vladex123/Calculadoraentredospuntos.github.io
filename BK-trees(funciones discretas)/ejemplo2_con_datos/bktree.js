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

// Predefined list of products
const products = [
    { name: 'tv', stock: 10, reordered: 3, category: 'Electronics' },
    { name: 'gorro', stock: 15, reordered: 1, category: 'Clothing' },
    { name: 'celular', stock: 8, reordered: 5, category: 'Electronics' },
    { name: 'embutido', stock: 12, reordered: 2, category: 'Food' },
    { name: 'intro a python', stock: 20, reordered: 4, category: 'Books' },
    { name: 'tablet', stock: 6, reordered: 7, category: 'Electronics' },
    { name: 'medias', stock: 25, reordered: 3, category: 'Clothing' },
    { name: 'pollo', stock: 14, reordered: 1, category: 'Food' },
    { name: 'harry poter', stock: 18, reordered: 5, category: 'Books' },
    { name: 'alicia en el pais de las maravillas', stock: 22, reordered: 4, category: 'Electronics' },
    { name: 'mochila', stock: 7, reordered: 2, category: 'Clothing' },
    { name: 'conservas', stock: 9, reordered: 3, category: 'Food' },
    { name: 'c++', stock: 11, reordered: 6, category: 'Books' },
    { name: 'licuadora', stock: 23, reordered: 5, category: 'Electronics' },
    { name: 'casaca', stock: 5, reordered: 1, category: 'Clothing' },
    { name: 'salchicha', stock: 16, reordered: 4, category: 'Food' },
    { name: 'java', stock: 12, reordered: 3, category: 'Books' },
    { name: 'parlantes', stock: 8, reordered: 5, category: 'Electronics' },
    { name: 'buzo', stock: 10, reordered: 2, category: 'Clothing' },
    { name: 'verduras', stock: 19, reordered: 1, category: 'Food' }
];

// Insert predefined products into the BK-Tree
products.forEach(product => bktree.insert(product));

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
