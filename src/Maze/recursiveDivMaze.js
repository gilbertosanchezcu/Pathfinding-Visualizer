
export function recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls,mazeWalls) {
  if (rowEnd < rowStart || colEnd < colStart) {
		return;
	}
	if (!surroundingWalls) {
		let gridNodes = getAllNodes(grid);
		for (const node of gridNodes){
			if (node.row === 0 || node.col === 0 || node.row === 15 || node.col === 49) {
        node.isWall = true;
				mazeWalls.push(node);
			}
		}
		surroundingWalls = true;
	} 

	if (orientation === "horizontal") {
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
		let gridNodes = getAllNodes(grid);
    for (const node of gridNodes){
      if (node.row === currentRow && node.col !== colRandom && node.col >= colStart - 1 && node.col <= colEnd + 1){
        node.isWall = true;
        mazeWalls.push(node)
      }
    }
		

		if (currentRow - 2 - rowStart > colEnd - colStart) {
			recursiveDivisionMaze(grid, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls, mazeWalls);
		} else {
			recursiveDivisionMaze(grid, rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls, mazeWalls);
		}
		if (rowEnd - (currentRow + 2) > colEnd - colStart) {
			recursiveDivisionMaze(grid, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls, mazeWalls);
		} else {
			recursiveDivisionMaze(grid, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls, mazeWalls);
		}
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
		let gridNodes = getAllNodes(grid)
		for (const node of gridNodes){
      if (node.col === currentCol && node.row !== rowRandom && node.row >= rowStart - 1 && node.row <= rowEnd + 1){
        node.isWall = true;
        mazeWalls.push(node)
      }
    }
		
		if (rowEnd - rowStart > currentCol - 2 - colStart) {
			recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls, mazeWalls);
		} else {
			recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls, mazeWalls);
		}
		if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
			recursiveDivisionMaze(grid, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls, mazeWalls);
		} else {
			recursiveDivisionMaze(grid, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls, mazeWalls);
		}
	}
	return mazeWalls;
};
  
  function getAllNodes(grid) {
		const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        if (!node.isStart && !node.isFinish){
					nodes.push(node);
				}
      }
    }
    return nodes;
  };