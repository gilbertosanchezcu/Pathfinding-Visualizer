//Dijkstra's Algorithm 

export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid,startNode);
    while (!!unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) {
        return visitedNodesInOrder;
      } 
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode){
         console.log('visitedNodesInOder in Dijk', visitedNodesInOrder)
         return visitedNodesInOrder;
      } 
      updateUnvisitedNeighbors(closestNode, grid);
    }
  }
  
  function sortNodesByDistance(unvisitedNodes) {
    //insteaad of sorting everytime we can use a min heap that will always return the smallest node of the list
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    //push node above current cell
    if (row > 0) neighbors.push(grid[row - 1][col]);
    //push node below current cell 
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    //push node to the left of current cell 
    if (col > 0) neighbors.push(grid[row][col - 1]);
    //push node to the right of current cell
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  
  // Backtracks from the finishNode to find the shortest path.
  export function getNodesInShortestPathOrderDijkstra(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode.isShortestPath = true
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }