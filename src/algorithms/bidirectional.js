export function bidirectional(grid, startNode, endNode) {
  let visitedNodesInOrder = [];

  // Initialize queues for forward and backward search
  let forwardQueue = [startNode];
  let backwardQueue = [endNode];
  startNode.distance = 0;
  endNode.distance = 0;

  let forwardVisited = new Set();
  let backwardVisited = new Set();
  forwardVisited.add(startNode);
  backwardVisited.add(endNode);

  while (forwardQueue.length && backwardQueue.length) {
    // Forward step
    let forwardNode = forwardQueue.shift();
    visitedNodesInOrder.push(forwardNode);
    if (backwardVisited.has(forwardNode)) {
      return visitedNodesInOrder;
    }
    for (let neighbor of getNeighbors(forwardNode, grid)) {
      if (!forwardVisited.has(neighbor) && !neighbor.isWall) {
        forwardQueue.push(neighbor);
        forwardVisited.add(neighbor);
        neighbor.previousNode = forwardNode;
      }
    }

    // Backward step
    let backwardNode = backwardQueue.shift();
    visitedNodesInOrder.push(backwardNode);
    if (forwardVisited.has(backwardNode)) {
      return visitedNodesInOrder;
    }
    for (let neighbor of getNeighbors(backwardNode, grid)) {
      if (!backwardVisited.has(neighbor) && !neighbor.isWall) {
        backwardQueue.push(neighbor);
        backwardVisited.add(neighbor);
        neighbor.previousNode = backwardNode;
      }
    }
  }

  return visitedNodesInOrder; // Return visited nodes if no path is found
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}
