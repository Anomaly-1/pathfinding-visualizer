export function recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }

  if (!surroundingWalls) {
    let relevantIds = new Set([`${START_NODE_ROW}-${START_NODE_COL}`, `${FINISH_NODE_ROW}-${FINISH_NODE_COL}`]);
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (row === 0 || col === 0 || row === grid.length - 1 || col === grid[0].length - 1) {
          if (!relevantIds.has(`${row}-${col}`)) {
            grid[row][col].isWall = (type === 'wall');
            grid[row][col].weight = (type === 'wall') ? 0 : 15;
          }
        }
      }
    }
    surroundingWalls = true;
  }

  if (orientation === 'horizontal') {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];

    for (let col = colStart - 1; col <= colEnd + 1; col++) {
      if (col !== colRandom && currentRow > 0 && currentRow < grid.length - 1 && col > 0 && col < grid[0].length - 1) {
        if (currentRow !== START_NODE_ROW || col !== START_NODE_COL) {
          if (currentRow !== FINISH_NODE_ROW || col !== FINISH_NODE_COL) {
            grid[currentRow][col].isWall = (type === 'wall');
            grid[currentRow][col].weight = (type === 'wall') ? 0 : 15;
          }
        }
      }
    }

    recursiveDivisionMaze(grid, rowStart, currentRow - 2, colStart, colEnd, chooseOrientation(rowStart, currentRow - 2, colStart, colEnd), surroundingWalls, type, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL);
    recursiveDivisionMaze(grid, currentRow + 2, rowEnd, colStart, colEnd, chooseOrientation(currentRow + 2, rowEnd, colStart, colEnd), surroundingWalls, type, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL);
  } else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];

    for (let row = rowStart - 1; row <= rowEnd + 1; row++) {
      if (row !== rowRandom && currentCol > 0 && currentCol < grid[0].length - 1 && row > 0 && row < grid.length - 1) {
        if (row !== START_NODE_ROW || currentCol !== START_NODE_COL) {
          if (row !== FINISH_NODE_ROW || currentCol !== FINISH_NODE_COL) {
            grid[row][currentCol].isWall = (type === 'wall');
            grid[row][currentCol].weight = (type === 'wall') ? 0 : 15;
          }
        }
      }
    }

    recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, currentCol - 2, chooseOrientation(rowStart, rowEnd, colStart, currentCol - 2), surroundingWalls, type, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL);
    recursiveDivisionMaze(grid, rowStart, rowEnd, currentCol + 2, colEnd, chooseOrientation(rowStart, rowEnd, currentCol + 2, colEnd), surroundingWalls, type, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL);
  }
}

function chooseOrientation(rowStart, rowEnd, colStart, colEnd) {
  if (rowEnd - rowStart > colEnd - colStart) {
    return 'horizontal';
  } else if (colEnd - colStart > rowEnd - rowStart) {
    return 'vertical';
  }
  return Math.random() < 0.5 ? 'horizontal' : 'vertical';
}
