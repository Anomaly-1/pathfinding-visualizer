import React, { Component } from 'react';
import Cell from './cell/Cell';
import {
  Flex,
  VStack,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Input,
  Box,
  Text,
  Switch,
  Spacer,
  Divider,
  Center,
  Heading
} from '@chakra-ui/react';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/aStar';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { bidirectional } from '../algorithms/bidirectional';
import { greedy } from '../algorithms/greedy';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { recursiveDivisionMaze } from '../algorithms/mazeAlgorithms';
import './Visual.css'
import { motion } from "framer-motion";
import { LampContainer } from "./components/Lamp.tsx";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import {ArrowBackIcon, ArrowForwardIcon} from '@chakra-ui/icons'
import MultiPageCard from './components/MultiPageCard.jsx'

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;
let run = false;

export default class Visual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      isMousePressed: false,
      isDraggingStart: false,
      isDraggingFinish: false,
      isPlacingWeights: false,
      selectedAlgorithm: 'Dijkstra',
      weight: 1,
      speed: 0.1,
      isRunning: false,
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
    const { grid, isPlacingWeights, isRunning } = this.state;
    if (isRunning) return;

    if (grid[row][col].isStart) {
      this.setState({ isDraggingStart: true });
    } else if (grid[row][col].isFinish) {
      this.setState({ isDraggingFinish: true });
    } else {
      if (isPlacingWeights) {
        const newGrid = this.getNewGridWithWeightToggled(grid, row, col);
        this.setState({ grid: newGrid, isMousePressed: true });
      } else {
        const newGrid = this.getNewGridWithWallToggled(grid, row, col);
        this.setState({ grid: newGrid, isMousePressed: true });
      }
    }
  };

  handleMouseEnter = (row, col) => {
    const { grid, isMousePressed, isDraggingStart, isDraggingFinish, isPlacingWeights, isRunning } = this.state;
    if (isRunning) return;

    if (isDraggingStart) {
      this.moveStartNode(row, col);
    } else if (isDraggingFinish) {
      this.moveFinishNode(row, col);
    } else if (isMousePressed) {
      if (isPlacingWeights) {
        const newGrid = this.getNewGridWithWeightToggled(grid, row, col);
        this.setState({ grid: newGrid });
      } else {
        const newGrid = this.getNewGridWithWallToggled(grid, row, col);
        this.setState({ grid: newGrid });
      }
    }
  };

  handleMouseUp = () => {
    this.setState({ isMousePressed: false, isDraggingStart: false, isDraggingFinish: false });
  };

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isFinish) return newGrid;

    const newNode = {
      ...node,
      isWall: !node.isWall,
      isWeighted: node.isWall ? false : node.isWeighted, // Remove weight if placing a wall
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  getNewGridWithWeightToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isFinish) return newGrid;

    const newNode = {
      ...node,
      isWeighted: !node.isWeighted,
      weight: node.isWeighted ? 1 : this.state.weight,
      isWall: node.isWeighted ? node.isWall : false, // Remove wall if placing a weight
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

    if (run) {
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

      console.log(START_NODE_ROW + "-" + START_NODE_COL + "-" + FINISH_NODE_ROW + "-" + FINISH_NODE_COL)

      dijkstra(grid, startNode, finishNode)
      this.animateShortestPath(getNodesInShortestPathOrder(finishNode), 0, false);
    }
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

    if (run) {
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

      dijkstra(grid, startNode, finishNode)
      this.animateShortestPath(getNodesInShortestPathOrder(finishNode), 0, false);
    }
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, speed) {
    this.setState({ isRunning: true });
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, speed, true);
          this.setState({ isRunning: false });
        }, speed * 1000 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, speed * 1000 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, speed, norm) {
    if (!norm) {
      this.clearBoardwWall()
    }

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (norm) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        }
        else if (!norm) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path-modified';
        }
      }, speed * 1000 * i);
    }
  }

  setAlgorithm = (algorithm) => {
    this.setState({ selectedAlgorithm: algorithm });
  };

  handleWeightChange = (event) => {
    this.setState({ weight: event.target.value });
  };

  handleSpeedChange = (num) => {
    this.setState({ speed: num });
  };

  togglePlacementMode = () => {
    this.setState((prevState) => ({ isPlacingWeights: !prevState.isPlacingWeights }));
  };

  clearBoard = () => {
    run = false;
    const grid = this.createGrid(20, 50);
    this.setState({ grid, isRunning: false });

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

  clearBoardwWall = () => {
    run = false;
    const { grid } = this.state;
  
    // Preserve wall states from the previous grid
    const wallPositions = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].isWall) {
          wallPositions.push({ row: i, col: j });
        }
      }
    }
  
    // Create a new grid
    const newGrid = this.createGrid(20, 50);
  
    // Reapply wall states to the new grid
    for (let position of wallPositions) {
      newGrid[position.row][position.col].isWall = true;
    }
  
    // Update the state with the new grid
    this.setState({ grid: newGrid, isRunning: false });
  
    // Update the DOM to reflect the changes
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[0].length; j++) {
        const currentNode = document.getElementById(`node-${i}-${j}`);
        if (currentNode) {
          currentNode.className = newGrid[i][j].isWall ? 'node node-wall' : 'node';
        }
      }
    }
  
    // Restore the start and finish nodes
    document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node node-start';
    document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node node-finish';
  };
  
  
  

  visualizeAlgorithm = () => {
    this.clearBoardwWall();
    const { grid, selectedAlgorithm, speed } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    run = true;
  
    let visitedNodesInOrder = [];
    let nodesInShortestPathOrder = [];
  
    switch (selectedAlgorithm) {
      case 'Dijkstra':
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        break;
      case 'A*':
        visitedNodesInOrder = aStar(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        break;
      case 'BFS':
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        break;
      case 'DFS':
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        break;
      case 'Bidirectional':
        dijkstra(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        visitedNodesInOrder = bidirectional(grid, startNode, finishNode);
        break;
      case 'Greedy':
        visitedNodesInOrder = greedy(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        break;
      default:
        return;
    }
  
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, speed);
  };
  

  handleMazeGeneration = () => {
    const { grid } = this.state;
  
    // Create a copy of the grid to avoid mutating the state directly
    const newGrid = grid.map(row => row.map(node => ({ ...node })));
  
    // Call the recursiveDivisionMaze function to generate the maze
    recursiveDivisionMaze(newGrid, 0, grid.length - 1, 0, grid[0].length - 1, 'horizontal', false, 'wall', START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL);

    this.setState({ grid: newGrid });
  };
  

  render() {
    const { grid, isPlacingWeights, isRunning } = this.state;
    const speedDictionary = {
      0.01: "Fast",
      0.05: "Medium",
      0.1: "Slow"
    };

    const speedDescription = speedDictionary[this.state.speed];

    return (
      <Flex direction="column" align="center">
        <LampContainer>
          <motion.div
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
            style={{
              background: 'linear-gradient(to bottom right, slategray, lightgray)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              fontSize: '4rem',
              fontWeight: '500',
              fontFamily: 'Kanit, sans-serif',
              lineHeight: '1.1',
            }}
          >
            Pathfinding Visualizer
          </motion.div>
          <br />
          <br />
          <Flex width="100%">
            <Spacer />
            <Card
              bg="#020914"
              zIndex={10}
              boxShadow="0 0 20px 5px cyan"
              height="auto"
              size="lg"
              w={[200, 200, 200, 200, 400, 500]}
            >
              <CardBody>
                <HStack>
                  <VStack spacing={4} mt={10} p={10} borderRadius="md" height="80%">
                    <Menu>
                      <MenuButton
                        bg="#52abcc"
                        as={Button}
                        size="lg"
                        rightIcon={<ChevronDownIcon />}
                        fontFamily="Figtree"
                      >
                        {this.state.selectedAlgorithm}
                      </MenuButton>
                      <MenuList>
                        <MenuItem fontFamily="Figtree" onClick={() => this.setAlgorithm("Dijkstra")}>Dijkstra</MenuItem>
                        <MenuItem fontFamily="Figtree" onClick={() => this.setAlgorithm("A*")}>A*</MenuItem>
                        <MenuItem fontFamily="Figtree" onClick={() => this.setAlgorithm("BFS")}>BFS</MenuItem>
                        <MenuItem fontFamily="Figtree" onClick={() => this.setAlgorithm("DFS")}>DFS</MenuItem>
                        <MenuItem fontFamily="Figtree" onClick={() => this.setAlgorithm("Bidirectional")}>
                          Bidirectional
                        </MenuItem>
                        <MenuItem onClick={() => this.setAlgorithm("Greedy")}>Greedy</MenuItem>
                      </MenuList>
                    </Menu>

                    <Button
                      bg="#52abcc"
                      size="lg"
                      onClick={this.visualizeAlgorithm}
                      isDisabled={isRunning}
                      fontFamily="Figtree"
                    >
                      Visualize
                    </Button>
                    <Button
                      fontFamily="Figtree"
                      bg="#52abcc"
                      size="lg"
                      onClick={this.clearBoard}
                      isDisabled={isRunning}
                    >
                      Clear Board
                    </Button>

                    <Button
                      bg="#52abcc"
                      fontFamily="Figtree"
                      size="lg"
                      onClick={this.handleMazeGeneration}
                      isDisabled={isRunning}
                    >
                      Generate Maze
                    </Button>

                    <Menu>
                      <MenuButton fontFamily="Figtree" size="lg" bg="#52abcc" as={Button} rightIcon={<ChevronDownIcon />}>
                        {speedDescription}
                      </MenuButton>
                      <MenuList>
                        <MenuItem fontFamily="Figtree" onClick={() => this.handleSpeedChange(0.01)}>Fast</MenuItem>
                        <MenuItem fontFamily="Figtree" onClick={() => this.handleSpeedChange(0.05)}>Medium</MenuItem>
                        <MenuItem fontFamily="Figtree" onClick={() => this.handleSpeedChange(0.1)}>Slow</MenuItem>
                      </MenuList>
                    </Menu>
                  </VStack>

                  <Spacer />

                  <Center height="20em">
                    <Divider orientation="vertical" />
                  </Center>

                  <Spacer />

                  <VStack>
                    <Box mt={2} color="white" fontSize="lg">
                      <Box mb={2} color="white">
                        <Box display="flex" alignItems="center">
                          <Box className="node node-start" mr={2} />
                          <Text fontFamily="Figtree">Start Node</Text>
                        </Box>
                        <Box display="flex" alignItems="center" mt={2}>
                          <Box className="node node-finish" mr={2} />
                          <Text fontFamily="Figtree">Finish Node</Text>
                        </Box>
                        {/* <Box display="flex" alignItems="center" mt={2}>
                          <Box className="node node-weighted" mr={2} />
                          <Text fontFamily="Figtree">Weighted Node</Text>
                        </Box> */}
                        <Box display="flex" alignItems="center" mt={2}>
                          <Box className="node node-wall" mr={2} />
                          <Text fontFamily="Figtree">Wall Node</Text>
                        </Box>
                        <Box display="flex" alignItems="center" mt={2}>
                          <Box className="node node-visited" mr={2} />
                          <Text fontFamily="Figtree">Visited Node</Text>
                        </Box>
                        <Box display="flex" alignItems="center" mt={2}>
                          <Box className="node node-shortest-path" mr={2} />
                          <Text fontFamily="Figtree">Shortest Path Node</Text>
                        </Box>
                        
                      </Box>
                    </Box>
                  </VStack>
                  <Spacer />
                </HStack>
              </CardBody>
            </Card>

            <Spacer />
            <Card
              align="center"
              bg="#020914"
              mt={8}
              boxShadow="0 0 20px 5px cyan"
              p={5}
              height="auto"
              size="lg"
              w="54%"
            >
              <CardBody>
                {grid && grid.length > 0 ? (
                    <Box display="grid" gridTemplateColumns={`repeat(${grid[0].length}, 1fr)`}>
                      {grid.map((row, rowIdx) => (
                        <React.Fragment key={rowIdx}>
                          {row.map((node, nodeIdx) => (
                            <Cell
                              key={`${rowIdx}-${nodeIdx}`}
                              {...node}
                              width={["10px", "10px", "15px", "15px", "20px", "30px"]} // Responsive width
                              height={["10px", "10px", "15px", "15px", "20px", "30px"]} // Responsive height
                              onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                              onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                              onMouseUp={() => this.handleMouseUp()}
                            />
                          ))}
                        </React.Fragment>
                      ))}
                    </Box>
                  ) : (
                    <Box>No grid data available.</Box>
                  )}
                </CardBody>
            </Card>
            <Spacer />
            <MultiPageCard />
            <Spacer />
          </Flex>
        </LampContainer>
      </Flex>
    );
  }
}
