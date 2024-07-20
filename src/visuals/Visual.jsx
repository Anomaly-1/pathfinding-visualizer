import React, { Component } from 'react';
import Cell from './cell/Cell';
import { Flex, VStack, HStack, Button, Menu, MenuButton, MenuItem, MenuList, Input, Box, Text } from '@chakra-ui/react';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/aStar';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { bidirectional } from '../algorithms/bidirectional';
import { greedy } from '../algorithms/greedy';
import { ChevronDownIcon } from '@chakra-ui/icons';

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

export default class Visual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      isMousePressed: false,
      isDraggingStart: false,
      isDraggingFinish: false,
      selectedAlgorithm: 'Dijkstra',
      weight: 1,
      speed: 0.1,
    };
  }

  componentDidMount() {
    const grid = this.createGrid(20, 50);
    this.setState({ grid });
  }

  createGrid(rows, cols) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === START_NODE_ROW && col === START_NODE_COL,
          isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          isBomb: false,
          isWeighted: false,
          weight: 1,
          previousNode: null,
        });
      }
      grid.push(currentRow);
    }
    return grid;
  }

  handleMouseDown = (row, col) => {
    const { grid } = this.state;
    if (grid[row][col].isStart) {
      this.setState({ isDraggingStart: true });
    } else if (grid[row][col].isFinish) {
      this.setState({ isDraggingFinish: true });
    } else {
      const newGrid = this.getNewGridWithWallToggled(grid, row, col);
      this.setState({ grid: newGrid, isMousePressed: true });
    }
  };

  handleMouseEnter = (row, col) => {
    const { grid, isMousePressed, isDraggingStart, isDraggingFinish } = this.state;
    if (isDraggingStart) {
      this.moveStartNode(row, col);
    } else if (isDraggingFinish) {
      this.moveFinishNode(row, col);
    } else if (isMousePressed) {
      const newGrid = this.getNewGridWithWallToggled(grid, row, col);
      this.setState({ grid: newGrid });
    }
  };

  handleMouseUp = () => {
    this.setState({ isMousePressed: false, isDraggingStart: false, isDraggingFinish: false });
  };

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  moveStartNode(newRow, newCol) {
    const { grid } = this.state;
    const newGrid = grid.slice();
    const oldStartNode = newGrid[START_NODE_ROW][START_NODE_COL];
    oldStartNode.isStart = false;
    newGrid[START_NODE_ROW][START_NODE_COL] = oldStartNode;
    
    const newStartNode = {
      ...newGrid[newRow][newCol],
      isStart: true,
      isWall: false, // Remove any wall that may be at the new position
    };
    newGrid[newRow][newCol] = newStartNode;
    this.setState({ grid: newGrid });
    START_NODE_ROW = newRow;
    START_NODE_COL = newCol;
  }

  moveFinishNode(newRow, newCol) {
    const { grid } = this.state;
    const newGrid = grid.slice();
    const oldFinishNode = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
    oldFinishNode.isFinish = false;
    newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = oldFinishNode;
    
    const newFinishNode = {
      ...newGrid[newRow][newCol],
      isFinish: true,
      isWall: false, // Remove any wall that may be at the new position
    };
    newGrid[newRow][newCol] = newFinishNode;
    this.setState({ grid: newGrid });
    FINISH_NODE_ROW = newRow;
    FINISH_NODE_COL = newCol;
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, speed) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, speed);
        }, speed * 1000 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, speed * 1000 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, speed) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, speed * 1000 * i);
    }
  }

  setAlgorithm = (algorithm) => {
    this.setState({ selectedAlgorithm: algorithm });
  };

  handleWeightChange = (event) => {
    this.setState({ weight: event.target.value });
  };

  handleSpeedChange = (event) => {
    this.setState({ speed: event.target.value });
  };

  handleWeightToggle = (row, col) => {
    const newGrid = this.state.grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isFinish || node.isWall || node.isBomb) return;
    const newNode = {
      ...node,
      isWeighted: !node.isWeighted,
      weight: node.isWeighted ? 1 : this.state.weight, // Toggle weight
    };
    newGrid[row][col] = newNode;
    this.setState({ grid: newGrid });
  };

  handleBombToggle = (row, col) => {
    const newGrid = this.state.grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isFinish || node.isWall || node.isWeighted) return;
    const newNode = {
      ...node,
      isBomb: !node.isBomb,
    };
    newGrid[row][col] = newNode;
    this.setState({ grid: newGrid });
  };

  clearBoard = () => {
    const grid = this.createGrid(20, 50);
    this.setState({ grid });
    
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        const currentNode = document.getElementById(`node-${i}-${j}`);
        if (currentNode) {
          currentNode.className = 'node';
        }
      }
    }

    // Restore the start and finish nodes
    document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node node-start';
    document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node node-finish';
  };

  visualizeAlgorithm = () => {
    const { grid, selectedAlgorithm, speed } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    let visitedNodesInOrder;
    switch (selectedAlgorithm) {
      case 'Dijkstra':
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      case 'A*':
        visitedNodesInOrder = aStar(grid, startNode, finishNode);
        break;
      case 'BFS':
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        break;
      case 'DFS':
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        break;
      case 'Bidirectional':
        visitedNodesInOrder = bidirectional(grid, startNode, finishNode);
        break;
      case 'Greedy':
        visitedNodesInOrder = greedy(grid, startNode, finishNode);
        break;
      default:
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, speed);
  };

  render() {
    const { grid, isMousePressed, selectedAlgorithm, weight, speed } = this.state;
    return (
      <>
        <Flex justify="center" align="center" p={4}>
          <VStack spacing={4}>
            <HStack spacing={4}>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {selectedAlgorithm}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => this.setAlgorithm('Dijkstra')}>Dijkstra</MenuItem>
                  <MenuItem onClick={() => this.setAlgorithm('A*')}>A*</MenuItem>
                  <MenuItem onClick={() => this.setAlgorithm('BFS')}>BFS</MenuItem>
                  <MenuItem onClick={() => this.setAlgorithm('DFS')}>DFS</MenuItem>
                  <MenuItem onClick={() => this.setAlgorithm('Bidirectional')}>Bidirectional</MenuItem>
                  <MenuItem onClick={() => this.setAlgorithm('Greedy')}>Greedy</MenuItem>
                </MenuList>
              </Menu>
              <Button onClick={this.visualizeAlgorithm}>Visualize</Button>
              <Button onClick={this.clearBoard}>Clear Board</Button>
            </HStack>
            <HStack spacing={4}>
              <Text>Speed: {speed}</Text>
              <Input
                type="number"
                value={speed}
                onChange={this.handleSpeedChange}
                min={0.01}
                max={2}
                step={0.01}
              />
            </HStack>
          </VStack>
        </Flex>
        <Box>
          {grid.map((row, rowIdx) => {
            return (
              <HStack key={rowIdx} spacing="0" justify="center">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall, isWeighted, isBomb } = node;
                  return (
                    <Cell
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isWeighted={isWeighted}
                      isBomb={isBomb}
                      isMousePressed={isMousePressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={this.handleMouseUp}
                      onWeightToggle={(row, col) => this.handleWeightToggle(row, col)}
                      onBombToggle={(row, col) => this.handleBombToggle(row, col)}
                    />
                  );
                })}
              </HStack>
            );
          })}
        </Box>
      </>
    );
  }
}
