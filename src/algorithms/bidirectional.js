// Performs Bidirectional Search; returns all nodes in the order in which they were visited.
// Also makes nodes point back to their previous node, effectively allowing us to compute the shortest path by backtracking from the finish node.
export function bidirectional(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const queueStart = [startNode];
    const queueEnd = [finishNode];
    startNode.isVisited = true;
    finishNode.isVisited = true;
  
    while (queueStart.length && queueEnd.length) {
      const currentStartNode = queueStart.shift();
      const currentEndNode = queueEnd.shift();
      visitedNodesInOrder.push(currentStartNode, currentEndNode);
  
      if (currentStartNode === finishNode || currentEndNode === startNode || currentStartNode.isVisitedByEnd || currentEndNode.isVisitedByStart) {
        return visitedNodesInOrder;
      }
  
      const startNeighbors = getUnvisitedNeighbors(currentStartNode, grid, 'start');
      for (const neighbor of startNeighbors) {
        neighbor.isVisited = true;
        neighbor.isVisitedByStart = true;
        neighbor.previousNode = currentStartNode;
        queueStart.push(neighbor);
      }
  
      const endNeighbors = getUnvisitedNeighbors(currentEndNode, grid, 'end');
      for (const neighbor of endNeighbors) {
        neighbor.isVisited = true;
        neighbor.isVisitedByEnd = true;
        neighbor.previousNode = currentEndNode;
        queueEnd.push(neighbor);
      }
    }
  
    return visitedNodesInOrder;
  }
  
  function getUnvisitedNeighbors(node, grid, direction) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
    if (direction === 'start') {
      return neighbors.filter(neighbor => !neighbor.isVisited || neighbor.isVisitedByEnd);
    } else {
      return neighbors.filter(neighbor => !neighbor.isVisited || neighbor.isVisitedByStart);
    }
  }
  