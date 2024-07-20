// Performs A* algorithm (Generally improved version of Dijkstras); returns all nodes in the order in which they were visited. 
// Also makes nodes point back to their previous node, effectively allowing us to compute the shortest path by backtracking from the finish node.
export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.heuristic = calculateHeuristic(startNode, finishNode);
    const openSet = [startNode];
    const closedSet = [];
  
    while (openSet.length > 0) {
      sortNodesByDistanceAndHeuristic(openSet);
      const currentNode = openSet.shift();
      if (currentNode.isWall) continue;
      if (currentNode.distance === Infinity) return visitedNodesInOrder;
  
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor)) continue;
        const tentative_gScore = currentNode.distance + neighbor.weight;
        if (tentative_gScore < neighbor.distance) {
          neighbor.previousNode = currentNode;
          neighbor.distance = tentative_gScore;
          neighbor.heuristic = tentative_gScore + calculateHeuristic(neighbor, finishNode);
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
      closedSet.push(currentNode);
    }
    return visitedNodesInOrder;
  }
  
  function calculateHeuristic(node, finishNode) {
    const dx = Math.abs(node.row - finishNode.row);
    const dy = Math.abs(node.col - finishNode.col);
    return dx + dy;
  }
  
  function sortNodesByDistanceAndHeuristic(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => (nodeA.distance + nodeA.heuristic) - (nodeB.distance + nodeB.heuristic));
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  