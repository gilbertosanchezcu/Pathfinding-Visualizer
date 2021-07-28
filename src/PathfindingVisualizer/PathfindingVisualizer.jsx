import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrderDijkstra} from '../algorithms/dijkstra';
import {dfs, getNodesInShortestPathOrderDfs} from '../algorithms/dfs';
import {bfs, getNodesInShortestPathOrderBfs} from '../algorithms/bfs';
import {astar, getNodesInShortestPathOrderAstar} from '../algorithms/astar';
import {recursiveDivisionMaze} from '../Maze/recursiveDivMaze';
import {Carousel} from '../Notification/Carousel';
import '../Navbar/Navbar.css';
import './PathfindingVisualizer.css';
import NotesComponent from '../Notepad/NotesComponent';



export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      keyPress: false,
      startRow : 8,
      startCol : 15,
      endRow : 8,
      endCol : 35,
      start: false,
      wall: false,
      end: false,
      algoDone: false,
      algoType: '',
      notes:[],
    };
  } 



  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({grid});
    window.addEventListener("keydown", this.handleKeyDown)
    window.addEventListener("keyup", this.handleKeyUp)

    fetch('http://localhost:3001/api/v1/notes')
      .then(res => res.json())
      .then(notes => this.setState({notes}))

  };


  shouldComponentUpdate(prevProps, prevState){
    if(prevState.algoDone === false){
      return true
    }else {
      return false
    }
  }
  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row <16; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }  
    return grid;
  }
  createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === this.state.startRow && col === this.state.startCol,
      isFinish: row === this.state.endRow && col === this.state.endCol,
      distance: Infinity,
      weight: 1,
      isVisited: false,
      isShortestPath: false,
      isWall: false,
      isTrap: false,
      previousNode: null,
      g : Infinity,
      f : 0,
      h : 0,
      closed: false
    };
  };

  resetBoard = () => {
    const grid = this.getInitialGrid();

    this.setState({grid:grid,
      start: false,
      wall: false,
      end: false,
      algoDone: false,
      algoType: ''});

    for (const row of grid){
      for (const node of row){
        if (node.isStart){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start'
        }else if (node.isFinish){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish'
        }else{
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
        }
      }
    }
    return grid;
  }

  getNewStartWithToggle = (grid, row, col) => {
    const newGrid = grid.slice();
    const currStart = newGrid[this.state.startRow][this.state.startCol];
    const newStart = newGrid[row][col];
    if (row !== this.state.startRow || col !== this.state.startCol){
      currStart.isStart = false;
      newStart.isStart = true;
      this.setState({startRow: row, startCol: col});
    }

    return newGrid;
  }



  getNewTargetwithToggle = (grid, row, col) => {
    const newGrid = grid.slice();
    const currEnd = newGrid[this.state.endRow][this.state.endCol];
    const newEnd = newGrid[row][col];
    if (row !== this.state.endRow || col !== this.state.endCol){
      currEnd.isFinish = false;
      newEnd.isFinish= true;
      this.setState({endRow: row, endCol: col});
    }

    return newGrid;
  }

  getNewStartWithAlgo = (grid,row, col) => {
    if(grid[row][col].isWall) return;
    const gridCopy = grid.slice();
    let startNode = null;
    let finishNode = null;
    for (const rows of gridCopy){
      for (const node of rows){
        if (node.isTrap && !node.isWall){
          node.isStart = false;
          node.distance = Infinity;
          node.weight = 10;
          node.isTrap = true;
          node.isVisited = false;
          node.isShortestPath = false;
          node.previousNode = null;
          node.g = Infinity;
          node.f = 0;
          node.h = 0;
          node.closed = false; 
        }
        else if (!node.isTrap && !node.isWall){
          node.isStart = false;
          node.distance = Infinity;
          node.weight = 1;
          node.isTrap = false;
          node.isVisited = false;
          node.isShortestPath = false;
          node.previousNode = null;
          node.g = Infinity;
          node.f = 0;
          node.h = 0;
          node.closed = false;        
        }
        if (node.isFinish){
          finishNode = node
        }
        if (!node.isStart && !node.isFinish && !node.isWall && !node.isTrap){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
        }
        if (!node.isStart && !node.isFinish && !node.isWall && node.isTrap){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-trap'
        }

      }
    }
    gridCopy[row][col].isStart = true;
    startNode = gridCopy[row][col];

    if (this.state.algoType === 'dijkstra'){
      this.getDijkstra(gridCopy, startNode, finishNode)
    } else if (this.state.algoType === 'dfs'){
      this.getDfs(gridCopy, startNode, finishNode)
    } else if (this.state.algoType === 'bfs'){
      this.getBfs(gridCopy, startNode, finishNode)
    } else if (this.state.algoType === 'astar'){
      this.getAstar(gridCopy, startNode, finishNode)
    } 

    // this.setState({startRow:row, startCol:col})
    return gridCopy
  }

  getNewFinishWithAlgo = (grid, row, col) => {
    if(grid[row][col].isWall) return;
    const gridCopy = grid.slice();
    let startNode = null;
    let finishNode = null;
    for (const rows of gridCopy){
      for (const node of rows){
        if (node.isTrap && !node.isWall){
          node.isFinish = false;
          node.distance = Infinity;
          node.weight = 10;
          node.isTrap = true;
          node.isVisited = false;
          node.isShortestPath = false;
          node.previousNode = null;
          node.g = Infinity;
          node.f = 0;
          node.h = 0;
          node.closed = false;        
        } else if (!node.isTrap && !node.isWall){
          node.isFinish = false;
          node.distance = Infinity;
          node.weight = 1;
          node.isTrap = false;
          node.isVisited = false;
          node.isShortestPath = false;
          node.previousNode = null;
          node.g = Infinity;
          node.f = 0;
          node.h = 0;
          node.closed = false;   
        }
        if (node.isStart){
          startNode = node
        }
        if (!node.isStart && !node.isFinish && !node.isWall && !node.isTrap){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
        }
        if (!node.isStart && !node.isFinish && !node.isWall && node.isTrap){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-trap'
        }
        
      }
    }
    gridCopy[row][col].isFinish = true;
    finishNode = gridCopy[row][col];

    if (this.state.algoType === 'dijkstra'){
      this.getDijkstra(gridCopy, startNode, finishNode)
    } else if (this.state.algoType === 'dfs'){
      this.getDfs(gridCopy, startNode, finishNode)
    } else if (this.state.algoType === 'bfs'){
      this.getBfs(gridCopy, startNode, finishNode)
    } else if (this.state.algoType === 'astar'){
      this.getAstar(gridCopy, startNode, finishNode)
    } 

    // this.setState({startRow:row, startCol:col})
    return gridCopy

  }

  getDijkstra = (grid, startNode, finishNode) => {
    const start = startNode
    const finish = finishNode
    const updatedNodes = dijkstra(grid, start, finish);
    getNodesInShortestPathOrderDijkstra(finish)
    for (const node of updatedNodes){
      if (node.isStart && node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-start'
      } else if (node.isStart && !node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start-noshortestpath'
      } else if (node.isFinish && !node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish-noshortestpath'
      } else if (node.isFinish && node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-finish'
      } else if (node.isTrap && !node.isShortestPath && !node.isVisited){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-trap-noshortestpath'
      } else if (node.isTrap && node.isShortestPath && node.isVisited){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-trap'
      } else if (node.isShortestPath && !node.isTrap){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path'
      } else if (node.isVisited && !node.isStart && !node.isFinish && !node.isShortestPath && !node.isTrap && !node.isWall){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-dijkstra'
      } else if (node.isVisited && !node.isStart && !node.isFinish && !node.isShortestPath && node.isTrap && !node.isWall){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-trap-dijkstra-noanimate'
      } else if (node.isWall){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
      }
    }
    if (!finish.isVisited){
      document.getElementById(`node-${finish.row}-${finish.col}`).className = 'node node-finish-noshortestpath'
    }
  }

  getDfs = (grid, startNode, finishNode) => {
    const start = startNode;
    const finish = finishNode;
    const updatedNodes = dfs(grid, start, finish);
    getNodesInShortestPathOrderDfs(finish)
    for (const node of updatedNodes){
      if (node.isStart && node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-start'
      } else if (node.isStart && !node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start-noshortestpath'
      } else if (node.isFinish & node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-finish'
      } else if (node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path'
      } else if (node.isVisited && !node.isStart && !node.isFinish && !node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-dfs'
      } else if (node.isWall){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
      }
    }
    if (!finish.isVisited){
      document.getElementById(`node-${finish.row}-${finish.col}`).className = 'node node-finish-noshortestpath'
    } 
  }

  getBfs = (grid, startNode, finishNode) => {
    const start = startNode;
    const finish = finishNode;
    const updatedNodes = bfs(grid, start, finish);
    getNodesInShortestPathOrderBfs(finish)
    for (const node of updatedNodes){
      if (node.isStart && node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-start'
      } else if (node.isStart && !node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start-noshortestpath'
      } else if (node.isFinish & node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-finish'
      } else if (node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path'
      } else if (node.isVisited && !node.isStart && !node.isFinish && !node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-bfs'
      } else if (node.isWall){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
      }
    }
    if (!finish.isVisited){
      document.getElementById(`node-${finish.row}-${finish.col}`).className = 'node node-finish-noshortestpath'
    }
  }

  getAstar = (grid, startNode, finishNode) => {
    const start = startNode;
    const finish = finishNode;
    const updatedNodes = astar(grid, start, finish);
    getNodesInShortestPathOrderAstar(finish)
    for (const node of updatedNodes){
      if (node.isStart && node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-start'
      } else if (node.isStart && !node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start-noshortestpath'
      } else if (node.isFinish & node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-finish'
      } else if (node.isFinish && !node.isShortestPath){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish-noshortestpath'
      } else if (node.isTrap && !node.isShortestPath && !node.isVisited){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-trap-noshortestpath'
      } else if (node.isTrap && node.isShortestPath && node.isVisited){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-trap'
      } else if (node.isShortestPath && !node.isTrap){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path'
      } else if (node.isVisited && !node.isStart && !node.isFinish && !node.isShortestPath && !node.isTrap && !node.isWall){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-astar'
      } else if (node.isVisited && !node.isStart && !node.isFinish && !node.isShortestPath && node.isTrap && !node.isWall){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-trap-astar-noanimate'
      } else if (node.isWall){
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
      } 
    }
    if (!finish.isVisited){
      document.getElementById(`node-${finish.row}-${finish.col}`).className = 'node node-finish-noshortestpath'
    }
  }
  
  handleKeyDown = (event) =>{
    if (event.keyCode == 87) this.setState({keyPress: event.keyCode})
  }
  handleKeyUp = (event) =>{
    if (this.state.keyPress) this.setState({keyPress: false})
  }

  handleMouseDown = (row, col) => {
    if (row === this.state.startRow && col === this.state.startCol && !this.state.algoDone){
      const newGridStart = this.getNewStartWithToggle(this.state.grid, row, col);
      this.setState({grid: newGridStart, mouseIsPressed: true, start: true, end: false, wall: false});
    } else if (row === this.state.endRow && col === this.state.endCol && !this.state.algoDone){
      const newGridEnd = this.getNewTargetwithToggle(this.state.grid, row, col)
      this.setState({grid:newGridEnd, mouseIsPressed: true, start: false, end: true, wall: false})

      //check if i need to include this condition
    } else if (!this.state.keyPress && !this.state.algoDone) {
      // getNewGridWithWallToggled(this.state.grid, row, col)
      // this.setState({mouseIsPressed:true, start:false, end: false, wall:true})
      const newGridWall = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGridWall, mouseIsPressed: true, start: false, end: false, wall: true});
    } else if (this.state.grid[row][col].isStart && this.state.algoDone){
      this.setState({mouseIsPressed: true, start:true})}
      else if (this.state.grid[row][col].isFinish && this.state.algoDone){
      this.setState({mouseIsPressed: true, end:true})
    } else if (this.state.keyPress == 87 && !this.state.algoDone){
      const newGridTrap = getNewGridWithTrapToggled(this.state.grid, row, col)
      this.setState({grid: newGridTrap, mouseIsPressed: true, start:false, end:false, wall:false})
    }
  
  }

  handleMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    if (this.state.start && !this.state.algoDone){
      const newGridStart = this.getNewStartWithToggle(this.state.grid, row, col);
      this.setState({grid:newGridStart});
    } else if(this.state.end && !this.state.algoDone){
      const newGridEnd = this.getNewTargetwithToggle(this.state.grid, row, col);
      this.setState({grid: newGridEnd})
    } else if (this.state.wall && !this.state.algoDone){
      // getNewGridWithWallToggled(this.state.grid, row, col)
      const newGridWall = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGridWall})
    } else if (this.state.algoDone&&this.state.start){
      this.getNewStartWithAlgo(this.state.grid, row, col)
    } else if (this.state.algoDone && this.state.end){
      this.getNewFinishWithAlgo(this.state.grid, row, col)
    } else if (this.state.keyPress == 87 && !this.state.algoDone){
      const newGridTrap = getNewGridWithTrapToggled(this.state.grid, row, col)
      this.setState({grid: newGridTrap})
    }

  }

  handleMouseUp = () => {
    this.setState({mouseIsPressed: false, start:false, end:false, wall:false});
  }
  
  clearWalls = () => {
    const newGrid = clearAllWalls(this.state.grid);
    this.setState({grid: newGrid});
  }

  clearWeights = () => {
    const newGrid = clearAllWeights(this.state.grid);
    this.setState({grid: newGrid});
  }

  animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.isStart){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-start-animate-dijkstra'
        } else if (node.isFinish){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-finish-animate-dijkstra'
        } else if (node.isTrap){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-trap-dijkstra'
        }
        else {document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited-animate-dijkstra';}
      }, 10 * i);
    }
  }

  animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.isStart){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortestPath-start-animate'
        } else if(node.isFinish && !node.isVisited){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish-noshortestpath'
        } else if (node.isFinish && node.isVisited){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortestPath-finish-animate'
        } else if (node.isTrap){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortestPath-trap-animate'
        }
        else {document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortestPath-animate';}
      }, 50 * i);
    }
  }


  animateDfs = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.isStart){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-start-animate-dfs'
        } else if (node.isFinish){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-finish-animate-dfs'
        }else {document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited-animate-dfs';
        }
      }, 10 * i);
    }
  }

  animateBfs = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.isStart){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-start-animate-bfs'
        } else if (node.isFinish){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-finish-animate-bfs'
        }else {document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited-animate-bfs';
        }
      }, 10 * i);
    }
  }

  animateAStar = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.isStart){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-start-animate-astar'
        } else if (node.isFinish){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-finish-animate-astar'
        } else if (node.isTrap){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited-trap-astar'
        } else {document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited-animate-astar';
        }
      }, 10 * i);
    }
  }

  animateRecusiveDivMaze = (wallsToAnimate) => {
    for (let i = 0; i < wallsToAnimate.length; i++) {
      setTimeout(() => {
        const node = wallsToAnimate[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-wall';
      }, 15 * i);
    }  
  }

  visualizeRecursiveDivMaze = () => {
    const {grid} = this.state;
    const mazeWalls = recursiveDivisionMaze(grid, 2, 13, 2, 47,"horizontal", false, [])
    this.animateRecusiveDivMaze(mazeWalls)
  }



  clearPathNewAlgo = (start, finish ,walls, traps) => {
    const grid = [];
    for (let row = 0; row < 16; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNodeNewAlgo(col, row, start,finish));
       
      }
      grid.push(currentRow);
    }  
    if (walls.length > 0){
      for (const rows of grid){
        for (const node of rows){
          for(const wallNode of walls){
            if (wallNode.row === node.row && wallNode.col === node.col){
              node.isWall = true
            }
          }
        }
      }
    } 
    if (traps.length > 0){
      for (const rows of grid){
        for (const node of rows){
          for (const trapNode of traps){
            if (trapNode.row === node.row && trapNode.col === node.col){
              node.isTrap = true;
              node.weight = 10;
            } 
          }
        }
      }
    }
    return grid ;
  }
    
  createNodeNewAlgo = (col, row, start,finish) => {
    return {
      col,
      row,
      isStart: row === start.row && col === start.col,
      isFinish: row === finish.row && col === finish.col,
      distance: Infinity,
      weight:1,
      isTrap:false,
      isVisited: false,
      isShortestPath: false,
      isWall: false,
      previousNode: null,
      g : Infinity,
      f : 0,
      h : 0,
      closed: false
    };
  };

  resetBoardNewAlgoDijkstra = (board) => {
    const grid = board;

    this.setState({grid:grid})
      // start: false,
      // wall: false,
      // end: false})
      // algoDone: false,
      // algoType: ''});
    
    let startNode = null;
    let finishNode = null;
    for (const row of grid){
      for (const node of row){
        if (node.isStart){
          startNode = node
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start'
        }else if (node.isFinish){
          finishNode = node
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish'
        } else if (node.isTrap){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-trap'
        } else if(node.isWall){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
        }else{
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
        }
      }
    }
    const dijkstraVisitedNodes = dijkstra(grid, startNode, finishNode)
    const shortestPath = getNodesInShortestPathOrderDijkstra(finishNode)
    this.animateDijkstra(dijkstraVisitedNodes, shortestPath)
  
    this.setState({algoDone:true, algoType: 'dijkstra'})
    return grid
  }
  resetBoardNewAlgoDfs = (board) => {
    const grid = board

    this.setState({grid:grid})
      // start: false,
      // wall: false,
      // end: false})
      // algoDone: false,
      // algoType: ''});
    
    let startNode = null;
    let finishNode = null;
    for (const row of grid){
      for (const node of row){
        if (node.isStart){
          startNode = node
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start'
        }else if (node.isFinish){
          finishNode = node
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish'
        }else if (node.isWall){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
        }
        else{
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
        }
      }
    }
    const dfsVisitedNodes= dfs(grid, startNode, finishNode)
    const dfsShortestPath = getNodesInShortestPathOrderDfs(finishNode)
    this.animateDfs(dfsVisitedNodes, dfsShortestPath)
  
    this.setState({algoDone:true, algoType: 'dfs'})
    return grid
    
  } 
  

  resetBoardNewAlgoBfs = (board) => {
    const grid = board

    this.setState({grid:grid})
      // start: false,
      // wall: false,
      // end: false})
      // algoDone: false,
      // algoType: ''});
    
    let startNode = null;
    let finishNode = null;
    for (const row of grid){
      for (const node of row){
        if (node.isStart){
          startNode = node
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start'
        }else if (node.isFinish){
          finishNode = node
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish'
        }else if (node.isWall){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
        }
        else{
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
        }
      }
    }
    const bfsVisitedNodes= bfs(grid, startNode, finishNode)
    const bfsShortestPath = getNodesInShortestPathOrderBfs(finishNode)
    this.animateBfs(bfsVisitedNodes, bfsShortestPath)
  
    this.setState({algoDone:true, algoType: 'bfs'})
    return grid
  } 
  resetBoardNewAlgoAstar = (board) => {
    const grid = board

    this.setState({grid:grid})
      // start: false,
      // wall: false,
      // end: false})
      // algoDone: false,
      // algoType: ''});
    
    let startNode = null;
    let finishNode = null;
    for (const row of grid){
      for (const node of row){
        if (node.isStart){
          startNode = node
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start'
        } else if (node.isFinish){
          finishNode = node
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish'
        } else if (node.isTrap){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-trap'
        } else if (node.isWall){
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
        }
        else{
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
        }
      }
    }
    const astarVisitedNodes= astar(grid, startNode, finishNode)
    const astarShortestPath = getNodesInShortestPathOrderAstar(finishNode)
    this.animateAStar(astarVisitedNodes, astarShortestPath)
  
    this.setState({algoDone:true, algoType: 'astar'})
    return grid
    
  } 
  
  visualizeDijkstra = () => {
    if (this.state.algoDone){
      this.setState({algoDone:false});
      const newGrid= this.state.grid
      let start = null
      let finish = null
      const walls = []
      const traps = []
      for (const rows of newGrid){
        for (const node of rows){
          if (node.isStart){
            start = node
          }
          if (node.isFinish){
            finish = node
          }
          if (node.isWall){
            walls.push(node)
          }
          if (node.isTrap){
            traps.push(node)
          }
        }
      }
      const newGridAlgoStart = this.clearPathNewAlgo(start, finish, walls, traps );
      this.resetBoardNewAlgoDijkstra(newGridAlgoStart, this.state.algoType);


    }else{
      const {grid} = this.state;
      const startNode = grid[this.state.startRow][this.state.startCol];
      const finishNode = grid[this.state.endRow][this.state.endCol];
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrderDijkstra(finishNode);
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
      this.setState({algoDone: true, algoType : 'dijkstra'})
    } 
  }

 
 
  visualizeDfs = () => {
    if (this.state.algoDone){
      this.setState({algoDone: false});
      const newGrid= this.state.grid
      let start = null;
      let finish = null;
      const walls = [];
      const traps = [];
      for (const rows of newGrid){
        for (const node of rows){
          if (node.isStart){
            start = node
          }
          if (node.isFinish){
            finish = node
          }
          if(node.isWall){
            walls.push(node)
          }
        }
      }
      const newGridAlgoStart = this.clearPathNewAlgo(start, finish, walls,traps);
      this.resetBoardNewAlgoDfs(newGridAlgoStart, this.state.algoType);
    } 
    else{
    this.clearWeights()
    const {grid} = this.state;
    const startNode = grid[this.state.startRow][this.state.startCol];
    const finishNode = grid[this.state.endRow][this.state.endCol];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDfs(finishNode);
    this.animateDfs(visitedNodesInOrder, nodesInShortestPathOrder);
    this.setState({algoDone: true, algoType: 'dfs'});
    } 
  }

  visualizeBfs = () => {
    if (this.state.algoDone){
      this.setState({algoDone: false});
      const newGrid= this.state.grid
      let start = null;
      let finish = null;
      const walls = [];
      const traps = [];
      for (const rows of newGrid){
        for (const node of rows){
          if (node.isStart){
            start = node
          }
          if (node.isFinish){
            finish = node
          }
          if(node.isWall){
            walls.push(node)
          }
        }
      }
      const newGridAlgoStart = this.clearPathNewAlgo(start, finish, walls, traps);
      this.resetBoardNewAlgoBfs(newGridAlgoStart, this.state.algoType);
    } else{
      this.clearWeights()
      const {grid} = this.state;
      const startNode = grid[this.state.startRow][this.state.startCol];
      const finishNode = grid[this.state.endRow][this.state.endCol];
      const visitedNodesInOrder = bfs(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrderBfs(finishNode);
      this.animateBfs(visitedNodesInOrder, nodesInShortestPathOrder);
      this.setState({algoDone: true, algoType: 'bfs'});
    }
  }
  
  visualizeAstar = () => {
    if (this.state.algoDone){
      this.setState({algoDone:false});
      const newGrid= this.state.grid
      let start = null
      let finish = null
      const walls = []
      const traps = []
      for (const rows of newGrid){
        for (const node of rows){
          if (node.isStart){
            start = node
          }
          if (node.isFinish){
            finish = node
          }
          if (node.isWall){
            walls.push(node)
          }
          if (node.isTrap){
            traps.push(node)
          }
        }
      }
      const newGridAlgoStart = this.clearPathNewAlgo(start, finish, walls, traps);
      this.resetBoardNewAlgoAstar(newGridAlgoStart, this.state.algoType);
    } else{
      const {grid} = this.state;
      const startNode = grid[this.state.startRow][this.state.startCol];
      const finishNode = grid[this.state.endRow][this.state.endCol];
      const visitedNodesInOrder = astar(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(finishNode);
      this.animateAStar(visitedNodesInOrder, nodesInShortestPathOrder);
      this.setState({algoDone: true, algoType: 'astar'});
    } 
  }

  updateNotes = newNotes => {
    // this.setState({notes:this.state.notes.concat(newNotes)})
    this.setState({notes: [newNotes].concat(this.state.notes)})
}


  render() {
    const {grid, mouseIsPressed} = this.state;
    return (
      <div className = 'parent'>
        <nav className = 'navbar'>
          <div className = 'algoButtons'>
            <button className = 'nav-item1' onClick={this.visualizeAstar}>
              A* Search
            </button> 
            <button className = 'nav-item2' onClick={this.visualizeDijkstra}>
              Dijkstra's Algorithm
            </button>
            <button className = 'nav-item3' onClick={this.visualizeBfs}>
              BFS Search 
            </button>
            <button className = 'nav-item4' onClick={this.visualizeDfs}>
              DFS Search 
            </button>
          </div>
          <div className = 'navbar-title'>
            <span>Pathfinding Visualizer</span>
          </div>
          <div className = 'otherButtons'>  
            <button  className = 'other-button' onClick = {this.clearWalls}>
                Clear Walls
              </button>
              <button className = 'other-button' onClick = {this.clearWeights}> 
                Clear Weights
              </button>
              <button className = 'other-button'  onClick = {this.visualizeRecursiveDivMaze}>
                Create Maze
              </button>
              <button className = 'other-button'  onClick = {this.resetBoard} >
                Reset Board
              </button>
           </div>
           </nav>

        <Carousel />

        <div className="grid" >
        
          {grid.map((row, rowIdx) => {
            return (
              //this is not the recommended way of setting key prop 
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall, isTrap, weight} = node
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isTrap={isTrap}
                      weight={weight}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}>
                    </Node>
                  )
                })}
              </div>
            )
          })}
        </div>
        <NotesComponent notes={this.state.notes} updateNotes={this.updateNotes}/>

      </div>  
    )
  }
}

const clearAllWeights = (grid) => {
  const newGrid = grid.slice();
  for (const row of newGrid){
    for (const node of row){
      if (node.isTrap){
        node.isTrap = !node.isTrap
      }
      if (document.getElementById(`node-${node.row}-${node.col}`).className === "node node-trap"){
        document.getElementById(`node-${node.row}-${node.col}`).className = "node";
      }
    }
  }
  return newGrid;
}

const clearAllWalls = (grid) => {
  const newGrid = grid.slice();
  for (const row of newGrid){
    for (const node of row){
      if (node.isWall){
        node.isWall = !node.isWall
      }
      if (document.getElementById(`node-${node.row}-${node.col}`).className === "node node-wall"){
        document.getElementById(`node-${node.row}-${node.col}`).className = "node";
      }
    }
  }
  return newGrid;
}



const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithTrapToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
   ...node,
   isTrap: !node.isTrap,
  };
  newNode.isTrap? newNode.weight = 10: newNode.weight = 1;
  newGrid[row][col] = newNode;
  return newGrid;
};