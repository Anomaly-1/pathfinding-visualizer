// Performs DFS (Depth First Search) algorithm; returns all nodes in the order in which they were visited. 
// Also makes nodes point back to their previous node, effectively allowing us to compute the shortest path by backtracking from the finish node.
export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];
  startNode.isVisited = true;

  while (stack.length) {
      const currentNode = stack.pop();
      visitedNodesInOrder.push(currentNode);

      if (currentNode === finishNode) return visitedNodesInOrder;

      const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of unvisitedNeighbors) {
          if (!neighbor.isVisited && !neighbor.isWall) {
              neighbor.isVisited = true;
              neighbor.previousNode = currentNode;
              stack.push(neighbor);
          }
      }
  }

  return visitedNodesInOrder;
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
