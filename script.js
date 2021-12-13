function renderBoard(numRows, numCols, grid) {


    let boardEl = document.querySelector("#board");



    for (let i = 0; i < numRows; i++) {
        let trEl = document.createElement("tr");
        for (let j = 0; j < numCols; j++) {
            let cellEl = document.createElement("div");
            cellEl.className = "cell";
            grid[i][j].cellEl = cellEl;

            this.parent.oncontextmenu = function() {
                return false;
            }

            cellEl.addEventListener("click", (e) => {
                if (grid[i][j].count === -1) {
                    explode(grid, i, j, numRows, numCols)
                    return;
                }

                if (grid[i][j].count === 0) {
                    searchClearArea(grid, i, j, numCols, numRows);
                } else if (grid[i][j].count > 0) {
                    grid[i][j].clear = true;
                    cellEl.classList.add("clear");
                    grid[i][j].cellEl.innerText = grid[i][j].count;



                }
                checkAllClear(grid);


            });


            let tdEl = document.createElement("td");
            tdEl.append(cellEl);

            trEl.append(tdEl);
        }
        boardEl.append(trEl);
    }
}



renderBoard.prototype.setDegree = function() {
    var button = document.getElementsByTagName("button");

    addEvent(button[0], "click", function() {
        var cellEl = new cellEl(10, 10, 10);

    });
    addEvent(button[1], "click", function() {
        var cellEl = new cellEl(16, 16, 50);
    });
}





const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
]



function initialize(numRows, numCols, numMines) {

    this.surplusMine = numMines;
    let grid = new Array(numRows);
    for (let i = 0; i < numRows; i++) {
        grid[i] = new Array(numCols);
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = {
                clear: false,
                count: 0
            };
        }
    }


    let mines = [];
    for (let k = 0; k < numMines; k++) {
        let cellSn = Math.trunc(Math.random() * numRows * numCols);
        let row = Math.trunc(cellSn / numCols);
        let col = cellSn % numCols;

        grid[row][col].count = -1;
        mines.push([row, col])
    }



    for (let [row, col] of mines) {
        console.log("mine:", row, col);
        for (let [drow, dcol] of directions) {
            let cellRow = row + drow;
            let cellCol = col + dcol;
            if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
                continue;
            }
            if (grid[cellRow][cellCol].count === 0) {
                console.log("target:", cellRow, cellCol);

                let count = 0;

                for (let [arow, acol] of directions) {
                    let amblientRow = cellRow + arow;
                    let amblientCol = cellCol + acol;
                    if (amblientRow < 0 || amblientRow >= numRows || amblientCol < 0 || amblientCol >= numCols) {
                        continue;
                    }

                    if (grid[amblientRow][amblientCol].count === -1) {
                        console.log("danger:", amblientRow, amblientCol);
                        count += 1;
                    }
                }

                if (count > 0) {
                    grid[cellRow][cellCol].count = count;

                }
            }


        }
    }


    return grid;
}


function searchClearArea(grid, row, col, numRows, numCols) {
    let gridCell = grid[row][col];
    gridCell.clear = true;
    gridCell.cellEl.classList.add("clear");



    for (let [drow, dcol] of directions) {
        let cellRow = row + drow;
        let cellCol = col + dcol;

        if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
            continue;
        }
        let gridCell = grid[cellRow][cellCol];
        console.log(cellRow, cellCol, gridCell);

        if (!gridCell.clear) {
            gridCell.clear = true;
            gridCell.cellEl.classList.add("clear");
            if (gridCell.count === 0) {
                searchClearArea(grid, cellRow, cellCol, numCols, numRows);

            } else if (gridCell.count > 0) {
                gridCell.cellEl.innerText = gridCell.count;
            }
        }

    }
}



function explode(grid, row, col, numRows, numCols) {
    grid[row][col].cellEl.classList.add("exploded");

    for (let cellRow = 0; cellRow < numRows; cellRow++) {
        for (let cellCol = 0; cellCol < numCols; cellCol++) {
            let cell = grid[cellRow][cellCol];

            cell.clear = true;
            cell.cellEl.classList.add('clear');

            if (cell.count === -1) {
                cell.cellEl.classList.add('landmine');
            }
        }
    }
}


function checkAllClear(grid) {
    for (let row = 0; row < grid.length; row++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col++) {
            let cell = gridRow[col];
            if (cell.count !== -1 && !cell.clear) {
                return false;
            }
        }
    }

    for (let row = 0; row < grid.length; row++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col++) {
            let cell = gridRow[col];

            if (cell.count === -1) {
                cell.cellEl.classList.add('landmine');
            }

            cell.cellEl.classList.add("success");
        }
    }

    return true;
}

let grid = initialize(9, 9, 16);
renderBoard(9, 9, grid);