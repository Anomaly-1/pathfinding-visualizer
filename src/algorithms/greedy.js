// Performs Greedy ('best' looking at every given moment) algorithm; returns all nodes in the order in which they were visited. 
// Also makes nodes point back to their previous node, effectively allowing us to compute the shortest path by backtracking from the finish node.
export function greedy(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.heuristicDistance = getHeuristicDistance(startNode, finishNode);
    const unvisitedNodes = [startNode];  // Start with only the start node in the list

    while (unvisitedNodes.length) {
        sortNodesByHeuristicDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        if (closestNode.heuristicDistance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, grid, unvisitedNodes, finishNode);
    }

    return visitedNodesInOrder;
}

function sortNodesByHeuristicDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristicDistance - nodeB.heuristicDistance);
}

function updateUnvisitedNeighbors(node, grid, unvisitedNodes, finishNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        if (!neighbor.isVisited) {
            neighbor.distance = node.distance + 1;
            neighbor.heuristicDistance = getHeuristicDistance(neighbor, finishNode);
            neighbor.previousNode = node;
            if (!unvisitedNodes.includes(neighbor)) {
                unvisitedNodes.push(neighbor);
            }
        }
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

function getHeuristicDistance(node, finishNode) {
    const dx = Math.abs(node.col - finishNode.col);
    const dy = Math.abs(node.row - finishNode.row);
    return dx + dy;
}
