import React, { Component } from 'react';
import { Card, CardBody, Box, Flex, Button, Heading, Text, List, ListItem, ListIcon } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import '../Visual.css'


class MultiPageCard extends Component {
  state = {
    currentPage: 0,
  };

  pages = [
    <Box key="page1" p={4}>
      <Heading fontFamily="Kanit" as="h2" size="lg" mb={4} color="cyan.400">Dijkstra's Algorithm</Heading>
      <Text fontFamily="Inter" fontSize="md" color="white" mb={2}>
        Dijkstra's algorithm finds the shortest paths from the source to all vertices in a graph with non-negative weights.
      </Text>
      <Heading fontFamily="Kanit" as="h3" size="md" color="cyan.300" mb={2}>Steps:</Heading>
      <List spacing={2} color="white">
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Initialize distances to all vertices as infinity, except for the source.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Set the source vertex distance to 0.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Create a priority queue and insert the source vertex.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />While the queue is not empty, extract the vertex with the smallest distance.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Update the distances of the adjacent vertices.</ListItem>
      </List>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={4}>
        <strong>Time Complexity:</strong> O(V^2) for the adjacency matrix, O(E + V log V) with the adjacency list and min-heap.
      </Text>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={2}>
        <strong>Space Complexity:</strong> O(V)
      </Text>
    </Box>,
    <Box key="page2" p={4}>
      <Heading fontFamily="Kanit"  as="h2" size="lg" mb={4} color="cyan.400">A* Algorithm</Heading>
      <Text fontFamily="Inter" fontSize="md" color="white" mb={2}>
        A* is a popular pathfinding algorithm that uses heuristics to find the shortest path more efficiently.
      </Text>
      <Heading fontFamily="Kanit" as="h3" size="md" color="cyan.300" mb={2}>Steps:</Heading>
      <List spacing={2} color="white">
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Initialize the open and closed lists.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Add the start node to the open list.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Repeat until the goal node is found:</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />a. Get the node with the lowest f(n) value from the open list.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />b. Move it to the closed list.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />c. For each neighbor, calculate g(n), h(n), and f(n) values.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />d. If the neighbor is in the closed list, ignore it.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />e. If the neighbor is not in the open list, add it.</ListItem>
      </List>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={4}>
        <strong>Time Complexity:</strong> O(E)
      </Text>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={2}>
        <strong>Space Complexity:</strong> O(V)
      </Text>
    </Box>,
    <Box key="page3" p={4}>
      <Heading fontFamily="Kanit" as="h2" size="lg" mb={4} color="cyan.400">Breadth-First Search (BFS)</Heading>
      <Text fontFamily="Inter" fontSize="md" color="white" mb={2}>
        BFS is used for traversing or searching tree or graph data structures, exploring all neighbor nodes at the present depth first.
      </Text>
      <Heading fontFamily="Kanit" as="h3" size="md" color="cyan.300" mb={2}>Steps:</Heading>
      <List spacing={2} color="white">
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Create a queue and enqueue the starting node.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Mark the starting node as visited.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />While the queue is not empty, repeat:</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />a. Dequeue a node from the queue.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />b. For each adjacent node, if not visited, enqueue it and mark as visited.</ListItem>
      </List>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={4}>
        <strong>Time Complexity:</strong> O(V + E)
      </Text>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={2}>
        <strong>Space Complexity:</strong> O(V)
      </Text>
    </Box>,
    <Box key="page4" p={4}>
      <Heading fontFamily="Kanit" as="h2" size="lg" mb={4} color="cyan.400">Depth-First Search (DFS)</Heading>
      <Text fontFamily="Inter" fontSize="md" color="white" mb={2}>
        DFS is used for traversing or searching tree or graph data structures, exploring as far as possible along each branch before backtracking.
      </Text>
      <Heading fontFamily="Kanit" as="h3" size="md" color="cyan.300" mb={2}>Steps:</Heading>
      <List spacing={2} color="white">
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Create a stack and push the starting node.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Mark the starting node as visited.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />While the stack is not empty, repeat:</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />a. Pop a node from the stack.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />b. For each adjacent node, if not visited, push it to the stack and mark as visited.</ListItem>
      </List>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={4}>
        <strong>Time Complexity:</strong> O(V + E)
      </Text>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={2}>
        <strong>Space Complexity:</strong> O(V)
      </Text>
    </Box>,
    <Box key="page5" p={4}>
      <Heading fontFamily="Kanit" as="h2" size="lg" mb={4} color="cyan.400">Bidirectional Search</Heading>
      <Text fontFamily="Inter" fontSize="md" color="white" mb={2}>
        Bidirectional search runs two simultaneous searches—one forward from the source and one backward from the goal.
      </Text>
      <Heading fontFamily="Kanit" as="h3" size="md" color="cyan.300" mb={2}>Steps:</Heading>
      <List spacing={2} color="white">
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Initialize two queues for forward and backward search.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Enqueue the starting node in the forward queue and the goal node in the backward queue.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />While both queues are not empty, repeat:</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />a. Expand the forward search from the front of the queue.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />b. Expand the backward search from the front of the queue.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />c. If the two searches meet, a path has been found.</ListItem>
      </List>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={4}>
        <strong>Time Complexity:</strong> O(b^(d/2))
      </Text>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={2}>
        <strong>Space Complexity:</strong> O(b^(d/2))
      </Text>
    </Box>,
    <Box key="page6" p={4}>
      <Heading fontFamily="Kanit" as="h2" size="lg" mb={4} color="cyan.400">Greedy Best-First Search</Heading>
      <Text fontFamily="Inter" fontSize="md" color="white" mb={2}>
        Greedy Best-First Search expands the most promising node according to a specified rule, such as the shortest estimated distance to the goal.
      </Text>
      <Heading fontFamily="Kanit" as="h3" size="md" color="cyan.300" mb={2}>Steps:</Heading>
      <List spacing={2} color="white">
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />Initialize the open list and add the start node.</ListItem>
        <ListItem fontFamily="Inter"><ListIcon as={CheckCircleIcon} color="cyan.400" />While the open list is not empty, repeat:</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />a. Get the node with the lowest heuristic value from the open list.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />b. If it is the goal node, return the path.</ListItem>
        <ListItem fontFamily="Inter" pl={4}><ListIcon as={CheckCircleIcon} color="cyan.400" />c. Otherwise, expand the node and update the open list.</ListItem>
      </List>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={4}>
        <strong>Time Complexity:</strong> O(V)
      </Text>
      <Text fontFamily="Inter" fontSize="md" color="white" mt={2}>
        <strong>Space Complexity:</strong> O(V)
      </Text>
    </Box>,
  ];

  handlePrevious = () => {
    this.setState((prevState) => ({
      currentPage: (prevState.currentPage - 1 + this.pages.length) % this.pages.length,
    }));
  };

  handleNext = () => {
    this.setState((prevState) => ({
      currentPage: (prevState.currentPage + 1) % this.pages.length,
    }));
  };

  render() {
    const { currentPage } = this.state;
    const MotionBox = Box; // motion()
    const rippleDelay = 0.2;

    return (
      <Card bg="#020914" zIndex={10} boxShadow="0 0 20px 5px cyan" height="auto" size={'lg'} w="20%">
        <CardBody>
        <MotionBox
            key={currentPage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delayChildren: rippleDelay,
              staggerChildren: rippleDelay,
              duration: 0.5,
              type: "spring",
            }}
          >
            {this.pages[currentPage]}
            <Flex justify="space-between" mt={4}>
              <Button bg="#52abcc" onClick={this.handlePrevious}>
                <ArrowBackIcon />
              </Button>
              <Button bg="#52abcc" onClick={this.handleNext}>
                <ArrowForwardIcon />
              </Button>
            </Flex>
          </MotionBox>
        </CardBody>
      </Card>
    );
  }
}

export default MultiPageCard;
