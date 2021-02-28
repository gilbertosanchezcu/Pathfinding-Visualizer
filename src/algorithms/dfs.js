//Dfs search algorithm 
//use stack


export function dfs(grid, startNode, finishNode) {
    const visitedNodes = [];
    const stack = [];
    stack.push(startNode);
    while (!!stack.length) {
      const currentNode = stack.pop();
      
      if (currentNode.isWall || currentNode.isVisited) continue;
      //append cells from all directions 
      currentNode.isVisited = true;
      visitedNodes.push(currentNode);
      if (currentNode === finishNode) return visitedNodes;

      const {row, col} = currentNode;
      //push node above current cell
      if (row > 0 && grid[row-1][col].isVisited === false){
        grid[row-1][col].previousNode = currentNode;
        stack.push(grid[row - 1][col]);
      } 
      //push node below current cell 
      if (row < grid.length - 1 && grid[row+1][col].isVisited === false){
        grid[row + 1][col].previousNode = currentNode;
        stack.push(grid[row + 1][col]);
      }
      //push node to the left of current cell 
      if (col > 0 && grid[row][col-1].isVisited === false){
        grid[row][col - 1].previousNode = currentNode;
        stack.push(grid[row][col - 1]);
      } 
      //push node to the right of current cell
      if (col < grid[0].length - 1 && grid[row][col+1].isVisited === false){
        grid[row][col + 1].previousNode = currentNode;
        stack.push(grid[row][col + 1]);
      }
    }
    return visitedNodes;
} 


  // Backtracks from the finishNode to find the shortest path.
  export function getNodesInShortestPathOrderDfs(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode.isShortestPath = true;
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
