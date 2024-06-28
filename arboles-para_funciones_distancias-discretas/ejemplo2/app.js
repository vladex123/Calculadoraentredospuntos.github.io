class BKTree {
    constructor(distanceFunc) {
        this.tree = null;
        this.distanceFunc = distanceFunc;
    }

    add(term) {
        if (this.tree === null) {
            this.tree = new Node(term);
        } else {
            this._add(this.tree, term);
        }
    }

    _add(node, term) {
        const distance = this.distanceFunc(term, node.term);
        if (node.children[distance]) {
            this._add(node.children[distance], term);
        } else {
            node.children[distance] = new Node(term);
        }
    }

    search(term, maxDistance) {
        if (this.tree === null) return [];

        let candidates = [this.tree];
        let results = [];

        while (candidates.length > 0) {
            let candidate = candidates.pop();
            let distance = this.distanceFunc(term, candidate.term);
            if (distance <= maxDistance) {
                results.push(candidate.term);
            }

            for (let d = Math.max(0, distance - maxDistance); d <= distance + maxDistance; d++) {
                if (candidate.children[d]) {
                    candidates.push(candidate.children[d]);
                }
            }
        }

        return results;
    }
}

class Node {
    constructor(term) {
        this.term = term;
        this.children = {};
    }
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    let matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, 
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

const bkTree = new BKTree(levenshteinDistance);
const usernames = [
    "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hank", 
    "Ivy", "Jack", "Kate", "Leo", "Mona", "Nina", "Oscar", "Paul", 
    "Quinn", "Rose", "Steve", "Tom", "Uma", "Vince", "Wendy", "Xander", 
    "Yara", "Zane", "Amy", "Brian", "Cathy", "Doug", "Ella", "Fred", 
    "George", "Hannah", "Isabel", "Jake", "Karen", "Liam", "Megan", 
    "Nora", "Owen", "Peter", "Queen", "Rachel", "Sam", "Tina", "Uri", 
    "Victor", "Will", "Xenia", "Yvonne", "Zach"
];
usernames.forEach(username => bkTree.add(username));

function suggestUsernames() {
    const input = document.getElementById('usernameInput').value;
    const suggestions = bkTree.search(input, 2);

    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = '';

    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion;
            suggestionsList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'No similar usernames found.';
        suggestionsList.appendChild(listItem);
    }
}
