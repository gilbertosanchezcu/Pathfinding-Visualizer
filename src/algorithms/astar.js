//astar algo
//need to add the (g,f,h) properties to each node 
//g - cost of path
//h - distance from current node to end node
//f - g+h

export function astar(grid, startNode, finishNode) {
    const visitedNodes = [];
    startNode.h = heuristicManhattan(startNode, finishNode)
    startNode.g = 0

    let openHeap = new BinaryHeap(function (node) {return node.f});
    openHeap.push(startNode)
    while (!!openHeap.content.length){
      //use heap to get the node with the lowest cost
      const currentNode = openHeap.pop();
      currentNode.closed = true
      visitedNodes.push(currentNode)
      if (currentNode === finishNode) return visitedNodes
      
      openHeap = updateUnvisitedNeighbors(currentNode, grid, finishNode, openHeap)

    }
    return visitedNodes;
}



    function heuristicManhattan(pos0, pos1) {
        const d1 = Math.abs(pos1.row - pos0.row);
        const d2 = Math.abs(pos1.col - pos0.col);
        return d1 + d2;
      }

    function updateUnvisitedNeighbors(node, grid, end, heap) {
      const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
      for (const neighbor of unvisitedNeighbors) {
        if (neighbor.closed || neighbor.isWall) continue;
        let newGScore = node.g + neighbor.weight
        const beenVisited = neighbor.isVisited
        if (neighbor.isVisited === false || newGScore<neighbor.g){
          neighbor.isVisited = true
          neighbor.g = newGScore
          neighbor.previousNode = node;
          neighbor.h = heuristicManhattan(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h

          if (!beenVisited){
            heap.push(neighbor);
          }else {
            heap.rescoreElement(neighbor);
          }
        }

      }

      return heap;
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
      return neighbors; 
    }


    function BinaryHeap(scoreFunction){
      this.content = [];
      this.scoreFunction = scoreFunction;
    }
    
    BinaryHeap.prototype = {
      push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
      },
    
      pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
          this.content[0] = end;
          this.sinkDown(0);
        }
        return result;
      },
    
      remove: function(node) {
        var length = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < length; i++) {
          if (this.content[i] != node) continue;
          // When it is found, the process seen in 'pop' is repeated
          // to fill up the hole.
          var end = this.content.pop();
          // If the element we popped was the one we needed to remove,
          // we're done.
          if (i == length - 1) break;
          // Otherwise, we replace the removed element with the popped
          // one, and allow it to float up or sink down as appropriate.
          this.content[i] = end;
          this.bubbleUp(i);
          this.sinkDown(i);
          break;
        }
      },
    
      size: function() {
        return this.content.length;
      },

      rescoreElement: function(node) {
        this.sinkDown(this.content.indexOf(node));
      },

      bubbleUp: function(n) {
        // Fetch the element that has to be moved.
        var element = this.content[n], score = this.scoreFunction(element);
        // When at 0, an element can not go up any further.
        while (n > 0) {
          // Compute the parent element's index, and fetch it.
          var parentN = Math.floor((n + 1) / 2) - 1,
          parent = this.content[parentN];
          // If the parent has a lesser score, things are in order and we
          // are done.
          if (score > this.scoreFunction(parent))
            break;
    
          // Otherwise, swap the parent with the current element and
          // continue.
          this.content[parentN] = element;
          this.content[n] = parent;
          n = parentN;
        }
      },
    
      sinkDown: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);
    
        while(true) {
          // Compute the indices of the child elements.
          var child2N = (n + 1) * 2, child1N = child2N - 1;
          // This is used to store the new position of the element,
          // if any.
          var swap = null;
          // If the first child exists (is inside the array)...
          if (child1N < length) {
            // Look it up and compute its score.
            var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
            // If the score is less than our element's, we need to swap.
            if (child1Score < elemScore)
              swap = child1N;
          }
          // Do the same checks for the other child.
          if (child2N < length) {
            var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
            if (child2Score < (swap == null ? elemScore : child1Score))
              swap = child2N;
          }
    
          // No need to swap further, we are done.
          if (swap == null) break;
    
          // Otherwise, swap and continue.
          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        }
      }
    }
    
  // Backtracks from the finishNode to find the shortest path.
  export function getNodesInShortestPathOrderAstar(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode.isShortestPath = true;
      currentNode = currentNode.previousNode;
    }
    console.log('nodesInShortestPathOrder', nodesInShortestPathOrder);
    return nodesInShortestPathOrder;
  }

