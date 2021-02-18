//Bfs search algorithm
//use queue to store unvisited nodes

export function bfs(grid, startNode, finishNode) {
    const visitedNodes = [];
    const queue = [];
    queue.push(startNode);
    while (!!queue.length) {
      const currentNode = queue.shift();

      if (currentNode.isWall) continue;
      if (currentNode.isVisited ===false) {
        currentNode.isVisited = true
        visitedNodes.push(currentNode);
      }
    
      if (currentNode === finishNode){
        return visitedNodes;}

      //add to the queue 
      const {row, col} = currentNode;
      //push node above current cell
      if (row > 0 && grid[row-1][col].isVisited === false && !(queue.includes(grid[row-1][col]))){
        grid[row-1][col].previousNode = currentNode;
        queue.push(grid[row - 1][col]);
      } 
      //push node below current cell 
      if (row < grid.length - 1 && grid[row+1][col].isVisited === false && !(queue.includes(grid[row+1][col]))){
        grid[row + 1][col].previousNode = currentNode;
        queue.push(grid[row + 1][col]);
      }
      //push node to the left of current cell 
      if (col > 0 && grid[row][col-1].isVisited === false && !(queue.includes(grid[row][col-1]))){
        grid[row][col - 1].previousNode = currentNode;
        queue.push(grid[row][col - 1]);
      } 
      //push node to the right of current cell
      if (col < grid[0].length - 1 && grid[row][col+1].isVisited === false && !(queue.includes(grid[row][col+1]))){
        grid[row][col + 1].previousNode = currentNode;
        queue.push(grid[row][col + 1]);
      }
    }
    return visitedNodes;

}

  // Backtracks from the finishNode to find the shortest path.
  export function getNodesInShortestPathOrderBfs(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode.isShortestPath = true;
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  

