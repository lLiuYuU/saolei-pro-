function renderBoard(numRows, numCols, grid) {
    let boardE1 = document.querySelector("#board");

    for (let i = 0; i < numRows; i++) {
        let trEl = document.createElement("tr");
        for (let j = 0; j < numCols; j++) {
            let cellEl = document.createElement("div");
            cellEl.className = "cell";
            grid[i][j].cellEl = cellEl;

            if (grid[i][j].count === -1) {
                cellEl.innerText = "*";

            } else {
                cellEl.innerText = grid[i][j].count;
            }





            cellEl.addEventListener("click", (e) => {
                if (grid[i][j].count === 0) {

                    searchClearArea(grid, i, j, numCols, numRows);

                }
                cellEl.classList.add("clear");

            });


            let tdEl = document.createElement("td");
            tdEl.append(cellEl);

            trEl.append(tdEl);
        }
        boardE1.append(trEl);
    }
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

        console.log(cellSn, row, col);

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
            console.log(row, col, row + drow, col + dcol);

        }
    }


    return grid;
}


function searchClearArea(grid, row, col, numRows, numCols) {


    for (let [drow, dcol] of directions) {
        let cellRow = row + drow;
        let cellCol = col + dcol;
        if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
            continue;
        }


        let gridCell = grid[cellRow][cellCol];

        if (!gridCell.clear) {
            gridCell.clear = true;
            gridCell.cellEl.classList.add("clear");
            if (gridCell.count === 0) {
                searchClearArea(grid, cellRow, cellCol, numCols, numRows);

            }
        }

    }
}

let grid = initialize(9, 9, 15);
renderBoard(9, 9, grid);